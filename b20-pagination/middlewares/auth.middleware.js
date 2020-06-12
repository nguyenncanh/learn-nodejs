var db = require('../db');

module.exports.requireAuth = function(req, res, next) {
  if (!req.signedCookies.userId) {
    res.redirect('/auth/login');
    return;
  }
  
  var user = db.get('users').find({id: req.signedCookies.userId}).value();
  
  if (!user) {
    res.redirect('/auth/login');
    return;
  }
  // truyền dữ liệu cho các hàm or trang phía sau.
  res.locals.user = user;
  next();
}