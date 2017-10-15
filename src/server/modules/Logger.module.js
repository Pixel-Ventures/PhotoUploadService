/*
* @Author: Craig Bojko
* @Date:   2017-02-01 14:30:20
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-14 02:27:09
*/

import 'colors'
import Winston from 'winston'
import prettyjson from 'prettyjson'

/* // Default colour settings
const DefaultLevels = {
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  }
}
*/
const LoggingLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    silly: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'yellow',
    silly: 'rainbow'
  }
}
Winston.addColors(LoggingLevels.colors)
Winston.setLevels(LoggingLevels.levels)

let logger = new (Winston.Logger)({
  exitOnError: false,
  level: 'silly',
  levels: LoggingLevels.levels,
  transports: [
    new (Winston.transports.Console)({
      timestamp: () => {
        let now = new Date()
        let timestamp = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
        return timestamp
      },
      formatter: (options) => {
        return '' +
          '[' + options.timestamp().toString().grey + '] ' +
          '[' + Winston.config.colorize(options.level, options.level.toUpperCase()) + '] ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n' +
          printMetaData(options) : '')
      },
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exceptionHandlers: [
    // new (Winston.transports.Console)({
    //   level: 'error',
    //   colorize: true,
    //   timestamp: true,
    //   json: true,
    //   prettyPrint: true,
    //   humanReadableUnhandledException: true,
    //   showLevel: true
    // }),
    // new (Winston.transports.File)({ // @TODO - come back to this
    //   filename: './log/exceptions.log',
    //   timestamp: true,
    //   maxsize: 1000000,
    //   colorize: false,
    //   timestamp: true,
    //   json: true,
    //   prettyPrint: true,
    //   humanReadableUnhandledException: true,
    //   showLevel: true
    // })
  ]
})

function printMetaData (data) {
  let meta = ''
  if (data.level === 'error') {
    meta = prettyjson.render(data.meta.stack, {})
  } else {
    meta = prettyjson.render(data.meta, {})
  }
  return meta
}

export default logger
