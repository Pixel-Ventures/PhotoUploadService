/*
* @Author: Craig Bojko
* @Date:   2017-10-14 21:03:51
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-14 12:17:46
*/

import path from 'path'
import { thumb } from 'node-thumbnail'

require('dotenv').config()

const DIR = process.env.UPLOAD

export default class Thumbnail {
  createThumbnail (filename) {
    return thumb({
      source: path.join(DIR, 'minified', filename),
      destination: DIR + '/thumbnails/',
      prefix: 'thumb_',
      suffix: '',
      digest: false,
      hashingType: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512'
      width: 200,
      overwrite: false
      // concurrency: <num of cpus>,
      // quiet: false, // if set to 'true', console.log status messages will be supressed
      // basename: undefined, // basename of the thumbnail. If unset, the name of the source file is used as basename.
      // ignore: false, // Ignore unsupported files in "dest"
      // logger: function(message) {
      //   console.log(message);
      // }
    })
  }

  customResize (filename, width) {
    return thumb({
      source: path.join(DIR, filename),
      destination: DIR + '/minified/',
      prefix: '',
      suffix: '',
      digest: false,
      hashingType: 'sha1',
      width: width,
      overwrite: false
    })
  }
}
