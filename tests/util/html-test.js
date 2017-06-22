var assert = require('chai').assert;
var html = require('../../lib/utils/html');

describe('html',function(){
  describe('renderTag',function(){
    itIs('input',null,null,'<input></input>');
    itIs('input',{id: '1'},null,'<input id="1"></input>');
    itIs('input',{id: '1'},'blah','<input id="1">blah</input>');
    itIs('input',{required: false},'blah','<input>blah</input>');
    itIs('input',{required: true},'blah','<input required>blah</input>');
    itIs('input',{klass: 'blah'},null,'<input class="blah"></input>');
    itIs('img',{src: '/a'},null,'<img src="/a"/>');

    function itIs(tag,attrs,content,expected) {
      var sut = html.renderTag;
      it(expected,function(){
        var actual = sut(tag,attrs,content);
        assert.equal(actual,expected);
      })
    }
  })
})
