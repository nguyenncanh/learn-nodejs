var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
    _id: String,
    cart: {
      type: Object
  }
});

var Session = mongoose.model("Session", sessionSchema, "sessions");

module.exports = Session;
