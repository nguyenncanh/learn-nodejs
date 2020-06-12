const db = require("../db");

module.exports = function(req, res, next) {
  var sessionId = req.signedCookies.sessionId;
  var user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();
  var sessions = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  
  var countCart = 0;
  if (sessions) {
    for (var productId in sessions.cart) {
      countCart = countCart + sessions.cart[productId];
    }
  }

  res.locals.countCart = countCart;
  res.locals.user = user;
  next();
};
