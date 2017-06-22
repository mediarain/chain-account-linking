'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

class AbstractTheme {
  constructor(link, options, theme_path) {
    this.link = link;
    this.option = options || {};
    this.assetCache = {};
    this.path = theme_path;
    this.asset_path = path.join(theme_path,'public-src');
  }

  resolveViewPath(view) {
    return path.join(this.path,'views',view);
  }

}

module.exports = AbstractTheme;
