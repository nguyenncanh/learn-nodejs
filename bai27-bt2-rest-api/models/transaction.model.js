var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
  idUser: String,
  idBooks: [],
  isComplete: Boolean
});

var Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = Transaction