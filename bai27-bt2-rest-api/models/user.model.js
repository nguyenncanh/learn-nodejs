var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  avatar: String,
  wrongLoginCount: {
    type: Number,
    default: 0,
  },
});

var User = mongoose.model('User', userSchema, 'users');

module.exports = User