//const db = require('../db');
var Book = require('../models/book.model');

//var oldPage = 0;
module.exports.index = async (req, res, next) => {
  try {
    //   var currentPage = parseInt(req.query.page) || 1; //n
    //   var perPage = 8; //x

    //   var start = (currentPage - 1) * perPage;
    //   var end = currentPage * perPage;
    //   var products = db.get('books').value();
    //   var totalPage = Math.ceil(products.length / perPage);

    //   if (currentPage > totalPage) {
    //     currentPage = totalPage
    //   } else if (currentPage < 1) {
    //     currentPage = 1
    //   }

    //cách 1: dùng arr.slice để cắt arr
    // var products = db.get('books').value();
    // res.render("products/index", {products: products.slice(start, end), 
    //                              currentPage: currentPage, 
    //                              totalPage: totalPage,
    //                              //oldPage: oldPage
    //                              });

    //oldPage = currentPage;

    //cách 2: dùng hàm take và drop của thư viện Lodash
    // var drop = (currentPage - 1) * perPage;
    // var products = db.get('books').drop(drop).take(perPage).value();
    // res.render("products/index", {products: products, 
    //                               currentPage: currentPage, 
    //                               totalPage: totalPage});
    var products = await Book.find();
    var a;
    a.b();
    res.render("products/index", {
      products: products
    });
  } catch (error) {
    next(error);
    res.render('error/500', {
      error: error
    })
  }
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
  var macthBooks = books.filter(function (book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render("products/index", { products: macthBooks, searchValue: q });
}
