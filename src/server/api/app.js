/*
* @Author: Craig
* @Date:   2016-11-27 16:06:31
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-07 18:20:46
*/

import APIRoot from './controllers/root'
import PhotoAPI from './controllers/photos'
import ReviewAPI from './controllers/review'

export default {
  root: new APIRoot(),
  photo: new PhotoAPI(),
  review: new ReviewAPI()
}
