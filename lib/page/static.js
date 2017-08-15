var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

module.exports = function(link, page, options){
  var router = page.router;
  router.use(serveStatic( path.join(link.path,'www','public'), {
    setHeaders: function (res, path) {
      res.header('Access-Control-Allow-Origin', '*');
    }
  }));
  router.use(serveStatic( path.join(__dirname, 'swagger')));
}
