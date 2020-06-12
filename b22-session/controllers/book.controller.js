var express = require("express");
var router = express.Router();
const db = require("../db");
const shortid = require("shortid");
var cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.index = (req, res) => {
  res.render("books/index", { books: db.get("books").value() });
};

module.exports.search = function(req, res) {
  var q = req.query.q;
  var macthBooks = db
    .get("books")
    .value()
    .filter(function(book) {
      return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });

  res.render("books/index", { books: macthBooks, searchValue: q });
};

module.exports.create = function(req, res) {
  res.render("books/create");
};

module.exports.view = function(req, res) {
  var id = req.params.id;

  var book = db
    .get("books")
    .find({ id: id })
    .value();
  res.render("books/view", {
    book: book
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.id;

  var book = db
    .get("books")
    .find({ id: id })
    .value();
  db.get("books")
    .remove(book)
    .write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});

  //db.get('books').value().splice(pos, 1);
  res.redirect("/books");
};

module.exports.update = function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input
  var book = db
    .get("books")
    .find({ id: id })
    .value();
  res.render("books/update", {
    book: book
  });
};

module.exports.postUpdate = function(req, res) {
  // Cập nhật dữ liệu
  db.get("books")
    .find({ id: req.params.id })
    .assign(req.body)
    .write();

  //var pos = db.get('books').value().findIndex((x) => {
  //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
  res.redirect("/books");
};

module.exports.postCreate = async function(req, res) {
  req.body.id = shortid.generate();
  var path = "";
  
  if (!req.file) {
    path =
      "'https://picsum.photos/286/180'";
  } else {
    path = await cloudinary.uploader.upload(req.file.path).then(doc => doc.url);
  }
  
  db.get("books")
    .push({id: req.body.id, title: req.body.title, des: req.body.des, coverUrl: path})
    .write();
  
  if(req.file){
    fs.unlinkSync(req.file.path);
  }
  
  res.redirect("/books");
};
