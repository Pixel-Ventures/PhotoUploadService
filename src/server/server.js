/*
* @Author: Craig Bojko
* @Date:   2017-03-26 00:38:09
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-14 23:04:18
*/

import 'colors'
import express from 'express'
import compress from 'compression'
import cookieParser from 'cookie-parser'
import Logger from './modules/Logger.module'

import APIRouter from './routes/api.router'

require('dotenv').config()

export default class EXPRESS_SERVER {
  constructor () {
    Logger.info('PHOTO-UPLOAD-SERVICE SERVER: '.magenta + process.env.SERVER + ':' + process.env.PORT)
    Logger.info('\n--- ** ---')
    this.app = express()
    this.run()
  }

  run () {
    this.app.set('port', process.env.PORT)

    this.setupMiddleware()
    this.setupRouting()
    this.app.listen(process.env.PORT)
  }

  setupMiddleware () {
    this.app.use(cookieParser())
    this.app.use(compress())
  }

  setupRouting () {
    this.app.use('/api', new APIRouter())
  }
}

new EXPRESS_SERVER()
