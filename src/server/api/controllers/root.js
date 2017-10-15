/*
* @Author: Craig Bojko
* @Date:   2017-01-30 13:11:31
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-15 00:47:08
*/

// import useragent from 'useragent'
import Thumbnail from '../../modules/Thumbnail.module'
import Logger from '../../modules/Logger.module'

const thumbnail = new Thumbnail()

export default class API {
  /**
   * Function calls createThumbnail below - doesn't return promise - returns to server response
   * @param  {[string]} filename [filename of file]
   * @return {[object]}          [object - server response]
   */
  createThumbnailRequest (filename) {
    this.createThumbnail(filename).then((data) => {
      Logger.info('Success')
      return {
        status: 200,
        response: data
      }
    }).catch((e) => {
      Logger.error('Error', e.toString())
      return {
        status: 500,
        msg: e
      }
    })
  }

  /**
   * Calls createThumbnail in module
   * @param  {[string]} filename [filename of file]
   * @return {[Promise]}          [promise object]
   */
  createThumbnail (filename) {
    return thumbnail.createThumbnail(filename)
  }
}
