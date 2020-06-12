var db = require('../db');
const shortid = require('shortid');

module.exports.addToCart = function(req, res, next) {
  var productId = req.params.productId;
  var sessionId = req.signedCookies.sessionId;
  
  if (!sessionId) {
    res.redirect('/products');
    return;
  }
  
  var count = db.get('sessions')
                .find({ id: sessionId})
                .get('cart.' + productId, 0)
                .value();
  
  db.get('sessions')
    .find({ id: sessionId })
    .set('cart.' + productId, count + 1)
    .write();
  
  res.redirect('/products');
}

module.exports.index = function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  
  var sessions = db.get('sessions')
                .find({ id: sessionId})
                .value();
  
  var books = db.get('books').value();
  
  var arrBookName = [];
  for (var productId in sessions.cart) {
    var bookName = books.find((book) => {
      return productId === book.id;
    });
    arrBookName.push(bookName);
  }
  
  res.render('cart/index', {
    sessions: sessions,
    books: arrBookName
  });
}

module.exports.rent = function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var userId = req.signedCookies.userId;
  var id = shortid.generate();
  var sessions = db.get('sessions')
                .find({ id: sessionId})
                .value();
  var user = db.get('users').find({ id: userId }).value();
  
  var arrBook = [];
  for (var productId in sessions.cart) {
    arrBook.push({bookId: productId, amount: sessions.cart[productId]});
  }
  
  db.get('transactions').push({ id: id, idUser: user.id, idBooks: arrBook, isComplete: false}).write();
  db.get('sessions').find({id: sessionId}).assign({ cart:  {}}).write();
  res.redirect('/cart');
}