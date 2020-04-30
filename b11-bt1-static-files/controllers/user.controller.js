const db = require('../db');
const shortid = require('shortid');
var express = require('express');
var router = express.Router();

module.exports.index = (req, res) => {
  res.render("users/index", {users: db.get('users').value()});
};

module.exports.search = function(req, res) {
  var q = req.query.q;
  var macthUsers = db.get('users').value().filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('users/index', 
             { users: macthUsers,
                searchValue : q
                                });
};

module.exports.create = function(req, res){
  res.render('users/create');
};

module.exports.view = function(req, res) {
  var id = req.params.id;
  
  var user = db.get('users').find({id: id}).value();
  res.render('users/view', {
    user: user
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.id;
  
  var user = db.get('users').find({id: id}).value();
  db.get('users').remove(user).write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  
  //db.get('books').value().splice(pos, 1);
  res.redirect('/users');
};

module.exports.update = function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  var user = db.get('users').find({id: id}).value();
  res.render('users/update', {
    user : user
  });
};

module.exports.postUpdate = function(req, res) {
  // Cập nhật dữ liệu
  db.get('users')
  .find({ id: req.params.id })
  .assign(req.body)
  .write();
  res.redirect('/users');
  
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
};

module.exports.postCreate = function(req, res) {
  req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
  res.redirect('/users');
};