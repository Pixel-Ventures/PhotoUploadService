/*
* @Author: Craig Bojko
* @Date:   2017-12-13 22:35:19
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-12-14 12:12:25
*/

import path from 'path'
import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminJpegRecompress from 'imagemin-jpeg-recompress'

require('dotenv').config()

const DIR = process.env.UPLOAD

export default class ImageMinify {
  minifyImage (filename) {
    return imagemin([DIR + '/minified/' + filename], DIR + '/minified', {
      optimizationLevel: 5,
      progressive: true,
      plugins: [
        imageminJpegRecompress(),
        imageminPngquant({quality: '65-80'})
      ]
      }
    )
  }
}
