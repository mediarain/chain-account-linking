var _ = require('lodash');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

module.exports = function(link, page, options){
  var router = page.router;
  router.use(serveStatic( path.join(link.path,'www','public'), {
    setHeaders: function (res, path) {
      if ( _.includes(path, 'public/img/alexa/alexa-')) {
        res.setHeader('Access-Control-Allow-Origin', ['http://ask-ifr-download.s3.amazonaws.com', 'https://ask-ifr-download.s3.amazonaws.com']);
        res.header('Access-Control-Allow-Methods', 'GET');
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
    }
  }));
  router.use(serveStatic( path.join(__dirname, 'swagger')));
}
