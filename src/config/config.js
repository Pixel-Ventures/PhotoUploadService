import 'colors'
import Logger from '../server/modules/Logger.module'
import Config from './config.json'

let path = require('path')
let env = process.env.NODE_ENV || 'development'
let rootPath = path.resolve(__dirname, '/..')
let config = Config

export default function (print) {
  if (print === true) {
    Logger.info('NODE ENV '.magenta, process.env.NODE_ENV)
    Logger.info('ENV '.magenta, env)
    Logger.info('ROOTPATH '.magenta, rootPath)
    Logger.info('APPLICATION CONFIG: '.magenta, config)
  }

  if (config) {
    config.root = rootPath
    return config
  } else {
    return {}
  }
}
