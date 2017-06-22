'use strict'
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = class Task {

  constructor(name,watches,op) {
    if(_.isFunction(watches)) {
      op = watches;
      watches = [];
    }
    this.name = name;
    this.watches = _.isArray(watches) ? watches : [watches];
    this.op = op;
  }

  run() {
    var self = this;
    var args = arguments;
    return Promise.try(() =>{
      var ret = this.op.apply(self,arguments);
      if(!ret) throw new Error(`Task '${this.name}' returned nothing actionable`)
      if(ret.on) {
         return new Promise((resolve, reject) => {
          ret.on('end', resolve);
          ret.on('error', reject);
        });
      }
      return ret;  //Could be a promise, or a direct value
    })
  }

}
