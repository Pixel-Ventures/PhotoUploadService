/*
* @Author: Craig Bojko
* @Date:   2017-12-07 18:21:16
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-07 19:42:48
*/

import Logger from '../../modules/Logger.module'
import MongoDB from '../../modules/MongoDB.module'

require('dotenv').config()

const Photos = MongoDB('photo')
const PhotoTransactions = MongoDB('photoTransactions')

export default class ReviewAPI {
  crud (req, res, next) {
    const method = req && req.method && req.method.toUpperCase()
    Logger.log('\n--- ** ---')
    Logger.debug('REQUEST: Method: %s URL: %s', req.method, req.url)
    if (method === 'POST') {
      Logger.debug('REQUEST: Body::', req.body)
    }

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
  const params = req.query
  const tid = params.transaction

  getTransactionFromDB(tid).then(transaction => {
    let reviewPromises = []
    let reviewingObjects = []

    for (let i = 0; i < transaction.files.length; i++) {
      const fileUID = transaction.files[i].uid
      reviewPromises.push(setPhotoForReview(fileUID))
      reviewingObjects.push({
        uid: transaction.files[i].uid,
        filename: transaction.files[i].filename,
        keyword: transaction.files[i].keyword
      })
    }

    Promise.all(reviewPromises).then(() => {
      // Return to XHR
      res.status(200).json({
        status: 200,
        review: reviewingObjects
      })
    }, (err) => {
      returnErrorToCaller(res, err, 'Problem running review routine')
    })
  }, err => {
    returnErrorToCaller(res, err, 'Unable to find transaction')
  })
}

function getTransactionFromDB (tid) {
  return new Promise((resolve, reject) => {
    PhotoTransactions.findOne({
      _id: tid
    }).exec(function (err, docs) {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  })
}

function setPhotoForReview (uid) {
  return new Promise((resolve, reject) => {
    Photos.findOne({
      uid: uid,
      enabled: true
    }).exec(function (err, doc) {
      if (err) {
        reject(err)
      } else {
        Logger.debug('PHOTO FOUND FOR REVIEW: %s', doc.filename)
        doc['review'] = true
        doc.save(() => {
          resolve(doc)
        })
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
