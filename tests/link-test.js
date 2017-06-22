'use strict';
var assert = require('chai').assert
  , chain = require('../lib')
;

describe('link', () => {
  let chainInstance
  beforeEach(() => {
    chainInstance = new chain.Chain();
  })
  describe('name',() => {
    it('derives the name from the folder',(done) => {
      chainInstance.link(function(link){
        assert.equal('tests', link.name)
        done();
      });
    })

    it('can use a name provided in the first arguement',(done) => {
      chainInstance.link('blah',function(link){
        assert.equal('blah', link.name)
        done();
      });
    })
  })
})
