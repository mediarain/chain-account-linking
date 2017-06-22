'use strict';
const _ = require('lodash');
const gulp = require('gulp');
const concat = require('gulp-concat');
const path = require('path');
const debug = require('gulp-debug');
const gulpif = require('gulp-if');
const merge = require('merge-stream');

module.exports = function(link, page, options) {

  const environment = link.chain.config;

  const src = path.join(link.path,'www/public-src/');
  const dest = path.join(link.path,'www/public/');

  const imgSrc = src +'img/**'

  const jsSrc = src + 'js/**'
  const jsDest = dest + 'js/'

  link.tasks.add('css', [src + 'less/main.less', src + 'css/**'], function(){
    const less = require('gulp-less');
    const autoprefixer = require('gulp-autoprefixer');
    return merge(doLess(link.require('theme').asset_path),doLess(src),doCss())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(dest + 'css/'))
    ;

    function doCss() {
      return gulp.src(src + 'css/**.css')
    }

    function doLess(src) {
      //TODO: We're always assuming that main.less is the root. Pull that out into some kind of config
      return gulp.src(path.join(src, 'less/main.less'))
      .pipe(less())
      .on('error', function(err) {
        console.log(err.stack || err);
        this.emit('end');
      })
    }

  })

  link.tasks.add('images',imgSrc,function(){
    const imagemin = require('gulp-imagemin');
    return merge(gulp.src(imgSrc),
                 gulp.src( path.join(link.require('theme').asset_path,'img')))
                 .pipe(imagemin())
                 .pipe(gulp.dest(dest + 'img'));
  })

  link.tasks.add('javascript',src,function(options){
    const sourcemaps = require('gulp-sourcemaps');
    const uglify = require('gulp-uglify');
    return merge(gulp.src(jsSrc), gulp.src(path.join(link.require('theme').asset_path,'js/**')) )
    .pipe(gulpif(options.prod, sourcemaps.init()))
    //.pipe(debug('js'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(gulpif(options.prod, uglify({mangle: false})))
    .pipe(gulpif(options.prod, sourcemaps.write('./', {includeContent: false, sourceRoot: 'source'})))
    .pipe(gulp.dest(jsDest));
  });

  link.tasks.add('s3', dest, function(options) {
    const s3 = require('gulp-s3-upload')({ useIAM: true }, environment.aws);
    return gulp.src(`${dest}/**`)
    .pipe(s3(environment.s3));
    });
    }
