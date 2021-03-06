const db = require('../db');

//var oldPage = 0;
module.exports.index = (req, res) => {
  var currentPage = parseInt(req.query.page) || 1; //n
  var perPage = 8; //x
  
  var start = (currentPage - 1) * perPage;
  var end = currentPage * perPage;
  var products = db.get('books').value();
  var totalPage = Math.ceil(products.length / perPage);
  
  if (currentPage > totalPage) {
    currentPage = totalPage
  } else if (currentPage < 1) {
    currentPage = 1
  }
  
  //cách 1: dùng arr.slice để cắt arr
  var products = db.get('books').value();
  res.render("products/index", {products: products.slice(start, end), 
                               currentPage: currentPage, 
                               totalPage: totalPage,
                               //oldPage: oldPage
                               });
  
  //oldPage = currentPage;
  
  //cách 2: dùng hàm take và drop của thư viện Lodash
  // var drop = (currentPage - 1) * perPage;
  // var products = db.get('books').drop(drop).take(perPage).value();
  // res.render("products/index", {products: products, 
  //                               currentPage: currentPage, 
  //                               totalPage: totalPage});
};
