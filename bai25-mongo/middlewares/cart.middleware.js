//const db = require("../db");
var User = require('../models/user.model');
var Session = require("../models/session.model");

module.exports = async function(req, res, next) {
  var sessionId = req.signedCookies.sessionId;
  // var user = db
  //   .get("users")
  //   .find({ id: req.signedCookies.userId })
  //   .value();
  var user = await User.findOne({ _id: req.signedCookies.userId });

  // var sessions = db
  //   .get("sessions")
  //   .find({ id: sessionId })
  //   .value();
  var sessions = await Session.findOne({ _id: sessionId });
  
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
