'use strict'
const Callsite = require('callsite');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const _ = require('lodash');
const Link = require('./link');
const http = require('http')
const server = require('./server');

class Chain {
  constructor(config, app) {
    this.app = app || server();
    this.links = [];
    this.linked = Promise.resolve(false);
    this.config = config;
  }

  link() {
    const plugins = Array.prototype.splice.call(arguments, 0);
    const name = deriveName(plugins);
    console.log(`🔗  Adding link ${name}`)

      this.link = new Link({
        name: name,
        chain: this,
        path: deriveDirectory()
      });

    _.forEach(plugins, plugin => plugin(this.link))

      const impliedPlugins = [];
    //Register implied plugins
    if(!this.link.hasInterface('content')){
      const content = require('./content');
      impliedPlugins.unshift(content());
    }
    if(!this.link.hasInterface('storage')) {
      const dynamostorage = require('./dynamostorage');
      impliedPlugins.unshift(dynamostorage());
    }
    if(!this.link.hasInterface('oauth')){
      const oauth = require('./oauth');
      impliedPlugins.unshift(oauth());
    }
    if(!this.link.hasInterface('identity')){
      const identity = require('./identity');
      impliedPlugins.unshift(identity());
    }

    _.forEach(impliedPlugins, plugin => plugin(this.link))
  }

  run(tasks, options) {
    options = Object.assign({},options);
    console.log('🏃  Running tasks',tasks.join(', '));

    return this.link.tasks.run(tasks,options)
      .then(() => {
        console.log('🍻  Tasks complete')
      });
  }

  watches(tasks) {
    return this.link.tasks.watches(tasks)
  }

  listen(port) {
    port = port || 3000;
    const server = http.createServer(this.app);
    server.listen(port, function () {
      console.log('👂  Listening for connections on', port);
    });
  }
}

//Uses some stack manipulation to get the name of the module (file) that had the invoking function
function deriveName(plugins) {
  if(_.isString(plugins[0])) return plugins.shift();
  var stack = Callsite();
  var filePath = stack[2].getFileName();
  return path.basename(path.dirname(filePath));
}

function deriveDirectory() {
  var stack = Callsite();
  var filePath = stack[2].getFileName();
  return path.dirname(filePath);
}
module.exports = Chain;
