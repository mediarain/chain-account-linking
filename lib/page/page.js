/*
- Setup gulp/build tasks
*/
function page(options) {
  return attach.bind(this,options);
}

function attach(options,link) {
  var self = {};
  require('./routing')(link,self,options)
  require('./static')(link,self,options)
  require('./error-handler')(link, self, options);
  require('./tasks')(link,self,options)

  link.registerInterface('page',self);
  link.registerInterface('router',self.router);
}

return module.exports = page;

