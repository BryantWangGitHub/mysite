
/*
 * GET home page.
 */

exports.test = function(req, res){
  res.render('test', { test: '测试' });
};
