var express = require('express');
var router = express.Router();
const db = require('../db');
const shortid = require('shortid');

router.get("/", (req, res) => {
  res.render("users/index", {users: db.get('users').value()});
});

router.get('/search', function(req, res) {
  var q = req.query.q.trim();
  var macthUsers = db.get('users').value().filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('users/index', 
             { users: macthUsers,
                searchValue : q
                                });
});

router.get('/create', function(req, res){
  res.render('users/create');
});

router.get('/:id/view', function(req, res) {
  var id = req.params.id;
  
  var user = db.get('users').find({id: id}).value();
  res.render('users/view', {
    user: user
  });
});

router.get('/:id/delete', function(req, res) {
  var id = req.params.id;
  
  var user = db.get('users').find({id: id}).value();
  db.get('users').remove(user).write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  
  //db.get('books').value().splice(pos, 1);
  res.redirect('/users');
});

router.get('/:id/update', function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  var user = db.get('users').find({id: id}).value();
  res.render('users/update', {
    user : user
  });
  // Cập nhật
  router.post('/:id/update', function(req, res) {
    db.get('users')
    .find({ id: req.params.id })
    .assign(req.body)
    .write();
    res.redirect('/users');
  });
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
});

router.post('/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
  res.redirect('/users');
});

module.exports = router;