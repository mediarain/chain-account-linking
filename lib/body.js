'use strict'
const Promise = require('bluebird');

module.exports = function body() {
  return function(link) {
    link.registerInterface('body', transformBody);
  };
}

function transformBody(form) {
  // just a passthrough for now
  return Promise.resolve(form);
}

