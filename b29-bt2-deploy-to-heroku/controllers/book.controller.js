var express = require("express");
var router = express.Router();
//const db = require("../db");
//const shortid = require("shortid");
var Book = require('../models/book.model');
var Shop = require('../models/shop.model');
var cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.index = async (req, res) => {
  //lowdb
  //res.render("books/index", { books: db.get("books").value() });

  //mongoose
  res.render("books/index", {books: await Book.find()});
};

module.exports.search = async function(req, res) {
  var q = req.query.q;
  //lowdb
  // var macthBooks = db
  //   .get("books")
  //   .value()
  //   .filter(function(book) {
  //     return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
  //   });

  var books = await Book.find();
  var macthBooks = books.filter(function(book) {
      return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });

  res.render("books/index", { books: macthBooks, searchValue: q });
};

module.exports.create = function(req, res) {
  res.render("books/create");
};

module.exports.view = async function(req, res) {
  var id = req.params.id;

  //lowdb
  // var book = db
  //   .get("books")
  //   .find({ id: id })
  //   .value();

  //mongoose
  var book = await Book.findById(id);

  res.render("books/view", {
    book: book
  });
};

module.exports.delete = async function(req, res) {
  var id = req.params.id;

  //lowdb
  // var book = db
  //   .get("books")
  //   .find({ id: id })
  //   .value();
  // db.get("books")
  //   .remove(book)
  //   .write();

  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1);

  //mongoose
  await Book.findByIdAndRemove(id).exec();

  res.redirect("/books");
};

module.exports.update = async function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input

  // lowdb
  // var book = db
  //   .get("books")
  //   .find({ id: id })
  //   .value();

  //mongoose
  var book = await Book.findById(id);

  res.render("books/update", {
    book: book
  });
};

module.exports.postUpdate = async function(req, res) {
  var id = req.params.id;
  // Cập nhật dữ liệu

  //lowdb
  // db.get("books")
  //   .find({ id: req.params.id })
  //   .assign(req.body)
  //   .write();

  //var pos = db.get('books').value().findIndex((x) => {
  //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();

  //mongoose
  await Book.findById(id, function(err, doc) {
    doc.title = req.body.title;
    doc.des = req.body.des;
    doc.save();
  });

  res.redirect("/books");
};

module.exports.createBook = async function(req, res) {
  var path = "";
  
  if (!req.file) {
    path = "https://picsum.photos/286/180";
  } else {
    path = await cloudinary.uploader.upload(req.file.path).then(doc => doc.url);
  }

  var shop = await Shop.findOne({ shopName: req.body.shopName });
  
  //lowdb
  // db.get("books")
  //   .push({id: req.body.id, title: req.body.title, des: req.body.des, coverUrl: path})
  //   .write();
  
  //mongoose
  var newBook = new Book({
    title: req.body.title,
    des: req.body.des,
    coverUrl: path,
    idShop: shop._id
  });
  await newBook.save();

  if(req.file){
    fs.unlinkSync(req.file.path);
  }
  
  res.redirect("/books");
};
