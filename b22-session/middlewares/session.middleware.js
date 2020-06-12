const shortid = require('shortid');
const db = require('../db');

module.exports = function(req, res, next) {
  if (!req.signedCookies.sessionId) {
    var sessionId = shortid.generate();
    res.cookie('sessionId', sessionId, {signed: true});
    var cart = {};
    db.get('sessions').push({id: sessionId, cart: cart}).write();
  }
  next();
}