'use strict'
const _ = require('lodash');
const Case = require('case');
const Html = require('./utils/html');

module.exports = function fields() {
  var fields = _(arguments)
    .toArray()
    .map(defineField)
    .compact()
    .value()
  ;
  return function(link) {
    link.registerInterface('fields',fields)
  };
}

function defineField(def) {
  if(def == 'email') return new EmailField(def);
  if(def == 'firstName') return new NameField(def);
  if(def == 'lastName') return new NameField(def);
  if(def.type) {
    if(def.type == 'email') return new EmailField(def.name, def);
    if(def.type == 'name') return new NameField(def.name, def);
  }
  throw Error('Unknown field definition:',def);
}

/*
- isRequired
- validate (regexp)
- render field
*/

class Field {
  constructor(name,options) {
    this.name = name;
    options = _.defaults(options,{isRequired: true});
    this.isRequired = options.isRequired;
    this.label = options.label || name;
  }
}

class EmailField extends Field {
  constructor(name,def) {
    super(name || 'email',Object.assign({
      isRequired: true,
      label: 'Email'
    },def));
  }

  renderHTML(options) {
    return Html.renderTag('input', Object.assign({
      type: 'email',
      name: this.name,
      required: this.isRequired
    },options));
  }
}

class NameField extends Field {

  constructor(name,options) {
    super(name || 'name',Object.assign({
      label: Case.title(Case.lower(name))
    },options));
  }

  renderHTML(options) {
    return Html.renderTag('input', Object.assign({
      type: 'text',
      name: this.name,
      required: this.isRequired
    },options));
  }
}
