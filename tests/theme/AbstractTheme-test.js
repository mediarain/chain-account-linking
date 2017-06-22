'use strict';
const assert = require('chai').assert;
const AbstractTheme = require('../../lib/theme/AbstractTheme')
const Chain = require('../../lib/chain')
const path = require('path')

describe('AbstractTheme',() => {
  describe('resolveAsset',() => {

    itIs('img','logo','/img/logo.jpg');
    itIs('img','check','/img/check.png');

    function itIs(type, name, expected) {
      it(`${type}.${name} => ${expected}`,() => {
        var chain = new Chain(null);

        let theme = new AbstractTheme({name: 'example',path: path.join(__dirname,'../../example')},null, '');
        var actual = theme.resolveAsset(type,name);
        assert.equal(actual, expected);
      });
    }

  });
})
