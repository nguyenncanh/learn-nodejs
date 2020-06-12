var express = require('express');
var router = express.Router();
const db = require('../db');
const shortid = require('shortid');

module.exports.index = (req, res) => {
  res.render("books/index", {books: db.get('books').value()});
};

module.exports.search = function(req, res) {
  var q = req.query.q;
  var macthBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('books/index', 
             { books: macthBooks,
                searchValue : q
              }
  );
};

module.exports.create = function(req, res){
  res.render('books/create');
};

module.exports.view = function(req, res) {
  var id = req.params.id;
  
  var book = db.get('books').find({id: id}).value();
  res.render('books/view', {
    book: book
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.id;
  
  var book = db.get('books').find({id: id}).value();
  db.get('books').remove(book).write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  
  //db.get('books').value().splice(pos, 1);
  res.redirect('/books');
};

module.exports.update = function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  var book = db.get('books').find({id: id}).value();
  res.render('books/update', {
    book : book
  });
};

module.exports.postUpdate = function(req, res) {
  // Cập nhật dữ liệu
  db.get('books')
  .find({ id: req.params.id })
  .assign(req.body)
  .write();
  
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
  res.redirect('/books');
};

module.exports.postCreate = function(req, res) {
  req.body.id = shortid.generate();
  
  db.get('books').push(req.body).write();
  res.redirect('/books');
};