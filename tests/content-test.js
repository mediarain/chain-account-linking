'use strict'
const content = require('../lib/content');
const assert = require('chai').assert;
const path = require('path');

describe('content',function(){
  describe('direct access',function(){
    const itIs = itIsBuilder( (sut,cpath) => sut[cpath] );
    itIs('asset directly','single','a');
  })
  describe('paragraph',function(){
    const itIs = itIsBuilder( (sut,cpath) => sut.paragraph(cpath) );
    itIs('renders paragraphs from arrays','arrayOfSomething','<p>a</p>\n<p>b</p>');
    itIs('renders single paragraph from single value','single','<p>a</p>');
  })

    function itIsBuilder(op) {
      return (name,cpath,expected) => {
        it(name,() => {
          var link = new MockLink();
          content(path.join(__dirname,'test-assets/content'))(link);
          var sut = link.require('content');
          var actual = op(sut,cpath);
          assert.equal(actual,expected);
        })
      }
    }

})


class MockLink {
  registerInterface(name,obj) { this[name] = obj; }
  require(name) { return this[name]; }
}
