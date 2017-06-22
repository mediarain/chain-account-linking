'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const Chain = require('./chain/chain');

var tasks = ['images','css','javascript'];
var chain = null;

gulp.task('register',function(cb){
  chain = new Chain(require('express')());
  chain.discoverLinks()
  .then(cb.bind(null,null)).catch(cb);
})

gulp.task('watch',['register'], function () {
  nodemon({
    script: 'index.js',
    //watch: chain.watches(tasks), //TODO those watches should not be on everything, just on the compiles
    tasks: ['compile'],
    ext: 'json js',
    ignore: ['node_modules/**','**/public/**']
  });
});

gulp.task('compile',['register'],function(cb){
  chain.run(tasks,{})
    .then(cb.bind(null,null))
    .catch(cb.bind(null))
    ;
})
