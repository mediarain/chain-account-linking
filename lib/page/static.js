var _ = require('lodash');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

module.exports = function(link, page, options){
  var router = page.router;
  router.use(serveStatic( path.join(link.path,'www','public'), {
    setHeaders: function (res, path) {
      if ( _.includes(path, 'public/img/alexa/alexa-')) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
      }
    }
  }));
  router.use(serveStatic( path.join(__dirname, 'swagger')));
}
