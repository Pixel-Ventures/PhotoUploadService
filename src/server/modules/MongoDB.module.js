/*
* @Author: Craig Bojko
* @Date:   2017-02-17 12:11:37
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-14 22:48:06
*/

import Mongoose from 'mongoose'
import Logger from './Logger.module'

import PhotoModel from './models/photo.dbmodel'

require('dotenv').config()

const mongoDebug = true
let _connection = false
let models = {}

function setupMongoInterface (modelRequest) {
  if (!_connection) {
    Mongoose.Promise = global.Promise
    if (process.env.NODE_ENV === 'production') {
      Mongoose.connect(process.env.DB, {
        auth: {
          authdb: 'admin'
        }
      })
      _connection = true
    } else {
      Mongoose.set('debug', mongoDebug)
      Mongoose.connect(process.env.DB)
      _connection = true
    }

    if (!_connection) {
      Logger.error('Error connecting to MongoDB')
    }

    // CONNECTION EVENTS
    // When successfully connected
    Mongoose.connection.on('connected', () => {
      Logger.debug('Mongoose default connection open to ' + process.env.DB)
    })

    Mongoose.connection.on('error', (err) => {
      Logger.error('Mongoose default connection error: ' + err)
    })

    Mongoose.connection.on('disconnected', () => {
      Logger.debug('Mongoose default connection disconnected')
    })

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
      Mongoose.connection.close(() => {
        Logger.info('Mongoose default connection disconnected through app termination')
        process.exit(0)
      })
    })

    // Model Export object - essentially one property per table
    models = {
      photo: PhotoModel(Mongoose)
    }
  }
  return models[modelRequest]
}

export default function MongoDB (collection) {
  return setupMongoInterface(collection)
}
