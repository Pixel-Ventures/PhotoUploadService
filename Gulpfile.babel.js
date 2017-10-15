/*
* @Author: Craig Bojko
* @Date:   2017-02-01 11:19:38
* @Last Modified by:   Craig Bojko
* @Last Modified time: 2017-10-14 22:38:38
*/

// Engines
require('colors')
var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var exec = require('child_process').exec

// Building
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')
// var uglify = require('gulp-uglify')
var clean = require('gulp-clean')

// Linters
var jshint = require('gulp-jshint')
var standard = require('gulp-standard')
var stylish = require('jshint-stylish')

// Util
var fs = require('fs')
var runSequence = require('run-sequence')
var mergeStream = require('merge-stream')
var logger = require('gulp-logger')
var AppLogger = require('./src/server/modules/Logger.module')

require('dotenv').config()

/** ***********************
// Functions
*************************/
function log (start, end) {
  return logger({
    before: start,
    after: end,
    showChange: true
  })
}

/** ***********************
// Linters
*************************/
gulp.task('lint', function (cb) {
  return runSequence(
    'jshint',
    'standard',
    function () {
      AppLogger.info('LINT: COMPLETE.')
      cb()
    }
  )
})

gulp.task('jshint', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    // .pipe(jshint.reporter('fail'))
})

gulp.task('standard', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false,
      quiet: true
    }))
})

/** ***********************
// Server Tasks
*************************/
gulp.task('nodemon', ['build'], function (cb) {
  var nmCfg = require('./nodemon.json')

  return nodemon(nmCfg)
    .on('restart', function (FILENAMES) {
      let filename = FILENAMES[0]
      let parts = filename.split('/')
      let file = parts[parts.length - 1]
      exec("osascript -e 'display notification \"'" + file + "'\" with title \"Nodemon\" subtitle \"App restarted due to:\"'", function () {
        AppLogger.debug('NODEMON RESTART: %s', file)
      })
      setTimeout(function () {
        fs.writeFileSync('.rebooted', new Date().getTime())
      }, 1500)
    })
})

/** ***********************
// Watch functions
*************************/
// LISTEN TO SERVER FILES
gulp.task('watch:server', function (cb) {
  // bsInit() // setup BrowserSync
  return gulp.watch([
    'src/server/**/*.js',
    'src/server/**/*.html'
  ], function () {
    AppLogger.debug('WATCH:SERVER TRIGGERED')
  }) // ['build'])
})

/*************************
// Cleaning scripts
*************************/
gulp.task('clean', ['clean:server', 'clean:dist'])
gulp.task('clean:all', ['clean:server', 'clean:dist'])
gulp.task('clean:server', function () {
  return mergeStream(
    gulp.src('build/server', {read: false}).pipe(clean()),
    gulp.src('build/config', {read: false}).pipe(clean())
  )
})
gulp.task('clean:tmp', function () {
  return gulp
    .src('dist_tmp', {read: false})
    .pipe(clean())
})
gulp.task('clean:dist', function () {
  return gulp
    .src('dist', {read: false})
    .pipe(clean())
})

/*************************
// Babel build scripts
*************************/
gulp.task('babel:server', function () {
  var startTime = new Date().getTime()
  return gulp
    .src('src/server/**/**.js')
    .pipe(log('Starting Babel Build...', ''))
    .pipe(sourcemaps.init())
    .pipe(babel({
      sourceMap: true,
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/server'))
    .pipe(log('', 'Finished Babel Build: '.green + (function () {
      var endTime = new Date().getTime()
      var diff = (endTime - startTime) / 60
      return diff.toFixed(2) + ' seconds'
    })().magenta))
})

gulp.task('babel:config', function () {
  return gulp
    .src('src/config/**/**.js')
    // .pipe(sourcemaps.init())
    .pipe(babel({
      sourceMap: true,
      presets: ['es2015']
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/config'))
})

gulp.task('babel:prod', function () {
  var startTime = new Date().getTime()
  let serverStream = gulp
    .src('src/server/**/**.js')
    .pipe(log('Starting Babel Production Build...', ''))
    .pipe(babel({
      sourceMap: false,
      presets: ['es2015']
    }))
    // .pipe(uglify())
    // .pipe(concat('server.js'))
    .pipe(gulp.dest('dist_tmp/server'))
    .pipe(log('', 'Finished Babel Production Build: '.green + (function () {
      var endTime = new Date().getTime()
      var diff = (endTime - startTime) / 60
      return diff.toFixed(2) + ' seconds'
    })().magenta))

  let configStream = gulp
    .src('src/config/**/**.js')
    .pipe(babel({
      sourceMap: false,
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist_tmp/config'))

  return mergeStream(
    serverStream,
    configStream
  )
})

/*************************
// Server Copy scripts
*************************/
gulp.task('copy', function () {
  let streams = {
    serverStream: gulp.src('src/server/**/*.html').pipe(log('Starting Server Copy...', 'Server copy complete!')).pipe(gulp.dest('build/server')),
    serverStreamJSON: gulp.src('src/server/**/*.json').pipe(log('Starting Server JSON Copy...', 'Server JSON copy complete!')).pipe(gulp.dest('build/server')),
    configStream: gulp.src('src/config/**/*.json').pipe(log('Starting Config Copy...', 'Config copy complete!')).pipe(gulp.dest('build/config'))
  }

  return mergeStream(
    streams.serverStream,
    streams.serverStreamJSON,
    streams.configStream
  )
})

gulp.task('copy:prod', function () {
  let streams = {
    serverStream: gulp.src('src/server/**/*.html').pipe(log('Starting Server Copy...', 'Server copy complete!')).pipe(gulp.dest('dist_tmp/server')),
    serverStreamJSON: gulp.src('src/server/**/*.json').pipe(log('Starting Server JSON Copy...', 'Server JSON copy complete!')).pipe(gulp.dest('dist_tmp/server')),
    configStream: gulp.src('src/config/**/*.json').pipe(log('Starting Config Copy...', 'Config copy complete!')).pipe(gulp.dest('dist_tmp/config'))
  }

  return mergeStream(
    streams.serverStream,
    streams.serverStreamJSON,
    streams.configStream
  )
})

gulp.task('copy:dist', function () {
  return gulp.src('dist_tmp/**/*.*').pipe(log('Starting Distribution Copy...', 'Distribution copy complete!')).pipe(gulp.dest('dist'))
})

/*************************
// Developer routines
*************************/
gulp.task('default', ['develop'])
gulp.task('develop', ['nodemon'])

gulp.task('build', function (cb) {
  return runSequence(
    'lint',
    'clean:server',
    'babel:server',
    'babel:config',
    'copy',
    function () {
      AppLogger.info('SERVER BUILD: OK.')
      cb()
    }
  )
})

gulp.task('build:production', function (cb) {
  return runSequence(
    'clean:tmp',
    'babel:prod',
    'copy:prod',
    'clean:dist',
    'copy:dist',
    'clean:tmp',
    function () {
      AppLogger.info('PRODUCTION BUILD: OK.')
      cb()
    }
  )
})
