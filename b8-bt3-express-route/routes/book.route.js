var express = require('express');
var router = express.Router();
const db = require('../db');
const shortid = require('shortid');

router.get("/", (req, res) => {
  res.render("books/index", {books: db.get('books').value()});
});

router.get('/search', function(req, res) {
  var q = req.query.q.trim();
  var macthBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('books/index', 
             { books: macthBooks,
                searchValue : q
                                });
});

router.get('/create', function(req, res){
  res.render('books/create');
});

router.get('/:id/view', function(req, res) {
  var id = req.params.id;
  
  var book = db.get('books').find({id: id}).value();
  res.render('books/view', {
    book: book
  });
});

router.get('/:id/delete', function(req, res) {
  var id = req.params.id;
  
  var book = db.get('books').find({id: id}).value();
  db.get('books').remove(book).write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  
  //db.get('books').value().splice(pos, 1);
  res.redirect('/books');
});

router.get('/:id/update', function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  var book = db.get('books').find({id: id}).value();
  res.render('books/update', {
    book : book
  });
  // Cập nhật
  router.post('/:id/update', function(req, res) {
    db.get('books')
    .find({ id: req.params.id })
    .assign(req.body)
    .write();
    res.redirect('/books');
  });
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
});

router.post('/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

module.exports = router