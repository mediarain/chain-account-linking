const assert = require('chai').assert;
var Task = require('../../lib/models/task.js');

describe('task model',function(){
  describe('constructor',function(){
    it('finds the name when there are no watches',function(){
      var task = new Task('blah',someOp);
      assert.equal('blah',task.name)
      assert.equal(someOp,task.op)
      assert.equal(0,task.watches.length)
    })
    it('finds the name when there are watches',function(){
      var task = new Task('blah',[1,2,3],someOp);
      assert.equal('blah',task.name)
      assert.equal(someOp,task.op)
      assert.deepEqual([1,2,3],task.watches);
    })

  })

})

function someOp(){ return 101; };
