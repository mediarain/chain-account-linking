'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Chain = require('./chain');

module.exports = function server() {
  var app = express();
  globalServerSetup(app);
  return app;
}

function globalServerSetup(app) {
  //Saddly, I can't yet find a way to make these route specific yet, so we'll need to set them here
  app.set('views', ''); //The page plugin will prefix with the correct path
  app.set('view engine', 'ejs');

  //Everyone is going to want this, so just do it globally
  app.use(morgan('dev')); //TODO: get the right env here
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
}


