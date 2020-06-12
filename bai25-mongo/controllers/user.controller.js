// const db = require('../db');
// const shortid = require('shortid');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
var cloudinary = require("cloudinary").v2;
const fs = require('fs');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.index = async (req, res) => {
  var cookieUser = req.signedCookies.userId;
  //var user = db.get('users').find({id: cookieUser}).value();
  var user = await User.findOne({ _id: cookieUser });
  //var users = db.get('users').value();
  var users = await User.find();
  if (user.isAdmin === true) {
    res.render('users/index', {users: users});
  }
};

module.exports.search = async function(req, res) {
  var q = req.query.q;

  //lowdb
  // var macthUsers = db.get('users').value().filter(function(user) {
  //   return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
  // });

  //mongoose
  var users = await User.find();
  var macthUsers = users.filter(function (user) {
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

module.exports.view = async function(req, res) {
  var id = req.params.id;
  //lowdb
  //var user = db.get('users').find({id: id}).value();

  // mongoose
  var user = await User.findOne({_id: id})

  res.render('users/view', {
    user: user
  });
};

module.exports.delete = async function(req, res) {
  var id = req.params.id;

  //lowdb
  // var user = db.get('users').find({id: id}).value();
  // db.get('users').remove(user).write();

  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1);

  //mongooes
  await User.findByIdAndRemove(id).exec();
  
  res.redirect('/users');
};

module.exports.update = async function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  //lowdb
  //var user = db.get('users').find({id: id}).value();

  //mongoose
  var user = await User.findById(id);
  res.render('users/update', {
    user : user
  });
};

module.exports.postUpdate = async function(req, res) {
  var id = req.params.id;
  // Cập nhật dữ liệu
  //lowdb
  // db.get('users')
  // .find({ id: req.params.id })
  // .assign(req.body)
  // .write();

  //mongoose
  await User.findById(id, function(err, doc) {
    doc.name = req.body.name;
    doc.save();
  });

  res.redirect('/users');
  
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
};

module.exports.postCreate = async function(req, res) {
  var hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
  var path = '';
  if (!req.file) {
    path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
  } else {
    path = await cloudinary.uploader.upload(req.file.path).then(doc =>  doc.url)
  }

  //lowdb
  // db.get('users').push({id: req.body.id, 
  //                       name: req.body.name, 
  //                       phone: req.body.phone, 
  //                       email: req.body.email, 
  //                       password: hashPassword, 
  //                       avatar: path, 
  //                       isAdmin: false
  //                      }).write();

  //mongoose
  var newUser = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: hashPassword,
    avatar: path,
    isAdmin: false
  });
  await newUser.save();
  
  // xóa file ảnh để ko phải lưu trong file upload
  if(req.file){
    fs.unlinkSync(req.file.path);
  }
  
  res.redirect('/users');
};

module.exports.profile = async function(req, res) {
  var idUser = req.signedCookies.userId;
  //lowdb
  //res.render('users/profile', {users: db.get('users').find({idUser: idUser}).value()});

  //mongoose
  var user = await User.findById(idUser);
  res.render("users/profile", {
    users: user
  });
}

module.exports.updateProfile = async function (req, res) {
  var idUser = req.signedCookies.userId;
  
  //lowdb
  // db.get('users')
  // .find({ id: idUser})
  // .assign(req.body, {password: hashPassword})
  // .write();

  //mongoose
  await User.findById(idUser, function(err, doc) {
    doc.name = req.body.name;
    doc.phone = req.body.phone;
    doc.email = req.body.email;
    doc.save();
  });
  
  res.redirect('/users')
}

module.exports.avatar = async function(req, res) {
  var idUser = req.signedCookies.userId;
  //lowdb
  //res.render('users/profile/avatar', {users: db.get('users').find({idUser: idUser}).value()});
  
  //mongoose
  var user = await User.findById(idUser);
  res.render('users/profile/avatar', {users : user});
}

module.exports.updateAvatar = async function(req, res) {
  var id = req.signedCookies.userId;
  var path = '';
  if (!req.file) {
    path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
  } else {
    path = await cloudinary.uploader.upload(req.file.path).then(doc =>  doc.url)
  }

  //lowdb
  // db.get('users')
  // .find({ id: id})
  // .assign({avatar: path})
  // .write();

  //mongoose
  await User.findById(id, function(err, doc) {
    doc.avatar = path;
    doc.save();
  });
  
  // xóa file ảnh để ko phải lưu trong file upload
  if(req.file){
    fs.unlinkSync(req.file.path);
  }
  
  res.redirect('/users/profile'); 
}

module.exports.changePassword = async function(req, res) {
  var id = req.signedCookies.userId;
  var oldPass = req.body.oldPass;
  var newPass = req.body.newPass;
  var confirmPass = req.body.confirmPass;

  var user = await User.findById(id);

  if (bcrypt.compareSync(oldPass, user.password) === true) {
    if (newPass === confirmPass) {
      var hashNewPass = bcrypt.hashSync(newPass, bcrypt.genSaltSync(12));
      await User.findById(id, function(err, doc) {
        doc.password = hashNewPass;
        doc.save();
      });

      res.render("users/profile", {
        successMgs : 'Password change successfully'
      })
    } else {
      res.render("users/profile", {
        errors: ["The confirm password is not the same as the new password"],
        values: req.body
      });
      return;
    }
  } else {
    res.render("users/profile", {
      errors: ["Wrong password"],
      values: req.body
    });
    return;
  }
}