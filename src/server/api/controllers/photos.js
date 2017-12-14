/*
* @Author: Craig Bojko
* @Date:   2017-12-07 16:50:50
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-14 12:17:46
*/

import mv from 'mv'
import path from 'path'
import Logger from '../../modules/Logger.module'
import MongoDB from '../../modules/MongoDB.module'
import EMail from '../../modules/Mail.module'

require('dotenv').config()

const Photos = MongoDB('photo')
const PhotoTransactions = MongoDB('photoTransactions')
const UPLOADS = process.env.UPLOAD
const UPLOADS_S3 = process.env.UPLOADS3

let uploadedPhotos = []
let erroredPhotos = []

export default class PhotoAPI {
  crud (req, res, next) {
    const method = req && req.method && req.method.toUpperCase()
    Logger.log('\n--- ** ---')
    Logger.debug('REQUEST: Method: %s URL: %s', req.method, req.url)
    if (method === 'POST') {
      Logger.debug('REQUEST: Body::', req.body)
    }
    // Clear results
    uploadedPhotos = []
    erroredPhotos = []

    switch (method) {
      case ('GET'): return handleGetRequest.apply(this, [req, res, next])
      default:
        return res.status(401).json({
          status: 401,
          msg: 'Method not allowed'
        })
    }
  }
}

function handleGetRequest (req, res, next) {
  pullPhotosFromDB().then(photos => {
    let photoPromises = []
    let photoTransactions = []

    for (let i in photos) {
      const filename = photos[i].filename
      photoTransactions.push({
        uid: photos[i].uid,
        filename: photos[i].filename,
        keyword: photos[i].keyword
      })
      Logger.debug('PHOTO FILENAME TO MIGRATE: ', filename)

      photoPromises.push(new Promise((resolve, reject) => {
        let createThumbnail = this.root.createThumbnail
        let minifyImage = this.root.minifyImage
        let customResize = this.root.customResize
        photoMigrationRoutine.apply({createThumbnail, minifyImage, customResize, resolve, reject}, [filename, photos[i]])
      }))
    }

    Promise.all(photoPromises).then(() => {
      let digest = {
        status: 200,
        photos: uploadedPhotos,
        errors: erroredPhotos
      }

      if ((uploadedPhotos && uploadedPhotos.length) || (erroredPhotos && erroredPhotos.length)) {
        // Add a batch transaction to the DB for logging and to enable reviews
        PhotoTransactions.create({
          timestamp: Date.now(),
          files: photoTransactions
        }, (err, transaction) => {
          if (err) {
            Logger.error(err)
          } else {
            Logger.debug('INSERTED TRANSACTION ID: %s', transaction._id)
            digest.transaction = transaction._id
            digest.photoTransaction = photoTransactions
            // Send email to Admin
            let email = new EMail()
            email.sendReportMessage(digest)
          }
        })
      }

      // Return to XHR
      res.status(200).json({
        status: 200,
        photos: uploadedPhotos,
        errors: erroredPhotos
      })
    }, (err) => {
      returnErrorToCaller(res, err, 'Problem running photo routine')
      Logger.error('ERROR in photo migrate routine: ', erroredPhotos)
    })
  }, err => {
    returnErrorToCaller(res, err, 'Unable to find photos')
    Logger.error('Unable to find photos', erroredPhotos)
  })
}

function photoMigrationRoutine (filename, dbDocument) {
  this.customResize(filename, 1200).then(() => {
    this.minifyImage(filename).then(() => {
      this.createThumbnail(filename).then(resp => {
        let photoMovePromise = new Promise((resolve, reject) => moveFile.apply({resolve, reject}, [filename, false]))
        let minifiedMovePromise = new Promise((resolve, reject) => moveFile.apply({resolve, reject}, ['minified/' + filename, false]))
        let thumbnailMovePromise = new Promise((resolve, reject) => moveFile.apply({resolve, reject}, [filename, true]))

        Promise.all([photoMovePromise, minifiedMovePromise, thumbnailMovePromise]).then(() => {
          uploadedPhotos.push(filename)
          dbDocument.enabled = true
          dbDocument.save(() => {
            this.resolve()
          })
        }, (err) => {
          erroredPhotos.push({
            filename: filename,
            error: err
          })
          Logger.error(err)
          this.reject(err)
        }).catch(err => {
          erroredPhotos.push({
            filename: filename,
            error: err
          })
          Logger.error(err)
          this.reject(err)
        })
      }, err => {
        erroredPhotos.push({
          filename: filename,
          error: err,
          message: 'Unable to create thumbnail'
        })
        this.reject(err)
      })
    }, err => {
      erroredPhotos.push({
        filename: filename,
        error: err,
        message: 'Unable to minify'
      })
      this.reject(err)
    })
  }, err => {
    erroredPhotos.push({
      filename: filename,
      error: err,
      message: 'Unable to resize image'
    })
    this.reject(err)
  })
}

function moveFile (filename, thumbnail = false) {
  const currentFile = thumbnail ? path.join(UPLOADS, 'thumbnails', 'thumb_' + filename) : path.join(UPLOADS, filename)
  const destination = thumbnail ? path.join(UPLOADS_S3, 'thumbnails', 'thumb_' + filename) : path.join(UPLOADS_S3, filename)

  mv(currentFile, destination, (err) => {
    if (err) {
      this.reject(new Error(err))
    }
    this.resolve()
  })
}

function pullPhotosFromDB () {
  return new Promise((resolve, reject) => {
    Photos.find({
      review: { $exists: false },
      public: true,
      enabled: false
    }).exec(function (err, docs) {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  })
}

function returnErrorToCaller (res, err, msg) {
  Logger.error(err)
  res.status(500).json({
    status: 500,
    msg: msg,
    err: err
  })
}
