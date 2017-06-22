'use strict'
const _ = require('lodash');
const keyOnlyAttrs = _.fromPairs(_.map(['required'],x => [x,true]))
const selfTerminatingTags = _.fromPairs(_.map(['img'],x => [x,true]))

exports.renderTag = function(type, attrs, content) {
  attrs = attrs || {};
  content = content || '';
  var strattrs = _(attrs).map(attr).compact().value().join(' ');
  if(strattrs.length > 0) strattrs = ' ' + strattrs;
  if(selfTerminatingTags[type]) {
    if(content) throw new Error(`<${type}> tags may not have content, but ${content} was provided`);
    return `<${type}${strattrs}/>`
  }
  return `<${type}${strattrs}>${content}</${type}>`
}

function attr(value, key) {
  if(key == 'klass') key = 'class'
  if(keyOnlyAttrs.hasOwnProperty(key)) return value ? key : '';
  return `${key}="${value}"`;
}
