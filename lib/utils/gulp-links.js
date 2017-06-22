'use strict'
const through = require('through2');
const Chain = require('../chain.js');
const util = require('util');
const stream = require('stream');

util.inherits(LinkStream,stream.Readable);

function LinkStream(options) {
  stream.Readable.call(this,options);
}

LinkStream.prototype.addLink = function(linkPath) {
  this.push({path: linkPath});
}

LinkStream.prototype._read = function() {
  var self = this;
  Chain.getLinkDirs(function(err,linkPaths) {
    if(err) return console.error(err.stack);
    linkPaths.forEach(self.addLink.bind(self));
    self.push(null);
  });
}

module.exports = function(){
  var stream = new LinkStream();
  return stream;

  /*
  return through.obj(function(chunk,enc,callback){
    var self = this;
    Chain.isLinkDir(chunk.path,function(err,is){
      if(err) return callback(err);
      if(is) self.push(chunk);
      callback();
    });

  });
  */
}
