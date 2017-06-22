'use strict'
const fields = require('../lib/fields');
const assert = require('chai').assert;

describe('fields',function(){
  it('registers an interface',() => {
    let link = new MockLink();
    fields()(link);
    var inter = link.require('fields');
    assert.isOk(inter);
  })

  it('registers email fields implicitly',() => {
    let link = new MockLink();
    fields(['email'])(link);
    var inter = link.require('fields');
    assert.lengthOf(inter,1);
    var email = inter[0];
    assert.isTrue(email.isRequired);
    assert.include(email.renderHTML(),'type="email"');
    assert.include(email.renderHTML(),'name="email"');
  })

  it('registers email fields explicitly',() => {
    let link = new MockLink();
    fields({type: 'email', name: 'blah', isRequired: false})(link);
    var inter = link.require('fields');
    assert.lengthOf(inter,1);
    var email = inter[0];
    assert.isFalse(email.isRequired);
    assert.include(email.renderHTML(),'type="email"');
    assert.include(email.renderHTML(),'name="blah"');
  })

  it('picks a good label for names',() => {
    let link = new MockLink();
    fields('lastName')(link);
    var inter = link.require('fields');
    assert.lengthOf(inter,1);
    var name = inter[0];
    assert.equal(name.label,'Last Name');
  })
})

class MockLink {
  registerInterface(name,obj) { this[name] = obj; }
  require(name) { return this[name]; }
}
