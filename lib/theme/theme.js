'use strict';
const _ = require('lodash');
const AbstractTheme = require('./AbstractTheme');

module.exports = function(themeName, options) {
  var Theme = themeFactory(themeName);
  options = options || {};
  return function(link) {
    var theme = new Theme(link,options);
    link.registerInterface('theme',theme);
  };
}

//TODO Figure out how to register static assets for themes

function themeFactory(name) {
  if (name.prototype instanceof AbstractTheme) {
    return name;
  }

  try {

    return require('./' + name);
  }
  catch(e) {
    if(e.code && e.code == 'MODULE_NOT_FOUND' && e.message.includes(name)) throw new Error(`No such theme ${name}`)
    throw e;
  }
}
