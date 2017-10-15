/*
* @Author: Craig Bojko
* @Date:   2017-05-10 09:16:07
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-14 12:56:19
*/

import { Router } from 'express'
import API from '../api/app'

export default class APIRouter {
  constructor () {
    this.Router = Router()
    this.Router.get('/photos', API.photo.crud.bind(API))

    return this.Router
  }
}
