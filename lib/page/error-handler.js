
module.exports = function(link, page, options) {
  var router = page.router;
  /** 500 Error handler */
  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('error');
  });
};
