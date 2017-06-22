'use strict'
const path = require('path');
const AbstractTheme = require('../AbstractTheme');

class EdenTheme extends AbstractTheme {
  constructor(link,options) {
    super(link,options,__dirname);
  }
}

module.exports = EdenTheme;
