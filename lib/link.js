'use strict';
const _ = require('lodash');
const path = require('path');
const Promise = require('bluebird');
const Task = require('./models/task');


class Link {
  constructor(options) {
    Object.assign(this,options);
    this.tasks = new Tasks();
    this.interfaces = {};
    this.waitFors = [];
  }

  /***** Interface  *****/
  registerInterface(name, obj) {
    if(!_.isString(name)) throw new Error(`Expected name of interface ${name} to be a string`);
    if(!name) throw new Error(`Expected name of interface to be a non-empty string`);
    if(!obj) throw new Error(`Cannot register a null interface named ${name}`);
    if(this.interfaces[name]) throw new Error(`Interface named ${name} is already registered`);
    this.interfaces[name] = obj;
  }

  require(name) {
    if(!this.interfaces.hasOwnProperty(name)) throw new Error(`Requiring a non-existant interface named ${name}`);
    return this.request(name);
  }

  request(name) { return this.interfaces[name]; }
  hasInterface(name) { return !!this.interfaces[name]; }
  waitFor(q) {
     this.waitFors.push(q);
  }

  wait() {
    return Promise.all(this.waitFors);
  }


  /***** Process  *****/
  login(form) {
    let id = this.require('identity')(form);
    let obj = Object.assign({}, _.pickBy(form), {id: id});
    return this.require('storage')
      .put(obj)
      .then(_.constant(obj));
  }
}

class Tasks {
  constructor(){
    this.items = {};
  }

  add(name, watches, op) {
    var task = new Task(name,watches,op);
    if(_.isUndefined(task.name)) throw Error('Task has no name',task);
    var list = (this.items[task.name] = this.items[task.name] || []);
    list.push(task);
  }

  run(taskNames, options) {
    var self = this;
    return Promise.map(taskNames, runOneTask);

    function runOneTask(name) {
      var tasks = self.items[name];
      if(!tasks ||!tasks.length) return Promise.resolve();
      return Promise.map(tasks,task => {
        return task.run(options);
      })
    }
  }

  watches(taskNames) {
    return _.flatMap(taskNames, taskName => _.flatMap(this.items[taskName], task => task.watches));
  }
}

module.exports = Link;
