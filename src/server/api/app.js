/*
* @Author: Craig
* @Date:   2016-11-27 16:06:31
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-14 21:38:39
*/

import APIRoot from './controllers/root'
import PhotoAPI from './controllers/photos'

export default {
  root: new APIRoot(),
  photo: new PhotoAPI()
}
