const db = require('../db');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
var cloudinary = require("cloudinary").v2;
const fs = require('fs');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.index = (req, res) => {
  var cookieUser = req.signedCookies.userId;
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

module.exports.postCreate = async function(req, res) {
  req.body.id = shortid.generate();
  var hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
  var path = '';
  if (!req.file) {
    path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
  } else {
    path = await cloudinary.uploader.upload(req.file.path).then(doc =>  doc.url)
  }

  db.get('users').push({id: req.body.id, 
                        name: req.body.name, 
                        phone: req.body.phone, 
                        email: req.body.email, 
                        password: hashPassword, 
                        avatar: path, 
                        isAdmin: false
                       }).write();
  
  // xóa file ảnh để ko phải lưu trong file upload
  if(req.file){
    fs.unlinkSync(req.file.path);
  }
  
  res.redirect('/users');
};

module.exports.profile = function(req, res) {
  var idUser = req.signedCookies.userId;
  res.render('users/profile', {users: db.get('users').find({idUser: idUser}).value()});
}

module.exports.updateProfile = function (req, res) {
  var idUser = req.signedCookies.userId;
  
  var hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
  
  db.get('users')
  .find({ id: idUser})
  .assign(req.body, {password: hashPassword})
  .write();
  
  res.redirect('/users')
}

module.exports.avatar = function(req, res) {
  var idUser = req.signedCookies.userId;
  res.render('users/profile/avatar', {users: db.get('users').find({idUser: idUser}).value()});
}

module.exports.updateAvatar = async function(req, res) {
  var id = req.signedCookies.userId;
  var path = '';
  if (!req.file) {
    path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
  } else {
    path = await cloudinary.uploader.upload(req.file.path).then(doc =>  doc.url)
  }

  db.get('users')
  .find({ id: id})
  .assign({avatar: path})
  .write();
  
  // xóa file ảnh để ko phải lưu trong file upload
  if(req.file){
    fs.unlinkSync(req.file.path);
  }
  
  res.redirect('/users/profile'); 
}