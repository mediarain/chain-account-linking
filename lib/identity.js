'use strict'
const shortid = require('shortid');

module.exports = function identity() {
  return function(link) {
    link.registerInterface('identity', getIdentity);
  };
}

function getIdentity(form) {
  return shortid.generate();
}
