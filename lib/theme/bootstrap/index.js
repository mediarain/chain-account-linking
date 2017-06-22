'use strict'

const path = require('path');
const AbstractTheme = require('../AbstractTheme')

class BootstrapTheme extends AbstractTheme {
  constructor(link,options) {
    super(link,options,__dirname);
  }
}

module.exports = BootstrapTheme;
