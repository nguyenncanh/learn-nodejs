const shortid = require('shortid');
// const db = require('../db');
var Session = require('../models/session.model');

module.exports = async function(req, res, next) {
  if (!req.signedCookies.sessionId) {
    var sessionId = shortid.generate();
    res.cookie('sessionId', sessionId, {signed: true});
    //db.get('sessions').push({id: sessionId, cart: cart}).write();
    var newSession = new Session({_id: sessionId});
    await newSession.save();
  }
  next();
}