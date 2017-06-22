'use strict';
const path = require('path');
const _ = require('lodash');

module.exports = function(pathToContent) {
  return function(link) {
    pathToContent = pathToContent || path.join(link.path,'content')
    var content = require(pathToContent);
    link.registerInterface('content', new Content(content))
  };
}

// A dummy class, but really it just holds all the content values
class Content {
  constructor(content) {
    Object.assign(this,content);
  }

  paragraph(cpath) {
    let content = _.get(this,cpath);
    if(!_.isArray(content)) content = [content];
    return content.map(x => `<p>${x}</p>`).join('\n');
  }
}
