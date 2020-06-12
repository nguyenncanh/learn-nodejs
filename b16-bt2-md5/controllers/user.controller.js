const db = require('../db');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

module.exports.index = (req, res) => {
  var cookieUser = req.cookies.userId;
  var user = db.get('users').find({id: cookieUser}).value();
  var users = db.get('users').value();
  if (user.isAdmin === true) {
    res.render('users/index', {users: users});
  } else {
    res.render("users/index", {users: user});
  }
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
  var hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
  
  db.get('users').push({id: req.body.id, name: req.body.name, phone: req.body.phone, email: req.body.email, password: hashPassword, isAdmin: false}).write();
  res.redirect('/users');
};