var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  title: String,
  coverUrl: String,
  des: String,
  price: String
});

var Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book