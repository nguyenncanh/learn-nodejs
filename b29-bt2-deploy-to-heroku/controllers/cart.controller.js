// var db = require('../db');
// const shortid = require('shortid');
var Session = require('../models/session.model');
var Book = require('../models/book.model');
var Transaction = require('../models/transaction.model');
var User = require('../models/user.model');

module.exports.addToCart = async function(req, res, next) {
  var productId = req.params.productId;
  var sessionId = req.signedCookies.sessionId;
  
  if (!sessionId) {
    res.redirect('/products');
    return;
  }
  
  // var count = db.get('sessions')
  //               .find({ id: sessionId})
  //               .get('cart.' + productId, 0)
  //               .value();
  var session = await Session.findById(sessionId);
  if (!session.cart) {
    await Session.findById(sessionId, function (err, doc) {
      var newCart = {};
      newCart[productId] = 1;
      doc.cart = newCart;
      doc.save();
    });
  } else {
    var count = session.cart[productId];
    var oldCart = session.cart;
    if (count) {
      var newPro = {};
      newPro[productId] = count + 1;
      var newCart = Object.assign(oldCart, newPro);
      await Session.findById(sessionId, function (err, doc) {
        doc.cart = newCart; 
        doc.save();
      });
    } else {
      var newPro = {};
      newPro[productId] = 1;
      var newCart = Object.assign(oldCart, newPro);
      await Session.findById(sessionId, function (err, doc) {
        doc.cart = newCart;
        doc.save();
      });
    }
   
  }
  
  // db.get('sessions')
  //   .find({ id: sessionId })
  //   .set('cart.' + productId, count + 1)
  //   .write();

  res.redirect('back');
}

module.exports.index = async function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  
  // var sessions = db.get('sessions')
  //               .find({ id: sessionId})
  //               .value();
  //var books = db.get('books').value();

  var sessions = await Session.findById(sessionId);
  var books = await Book.find();
  
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

module.exports.rent = async function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var userId = req.signedCookies.userId;

  //var id = shortid.generate();
  // var sessions = db.get('sessions')
  //               .find({ id: sessionId})
  //               .value();
  // var user = db.get('users').find({ id: userId }).value();

  var sessions = await Session.findById(sessionId);
  var user = await User.findById(userId);
  
  var arrBook = [];
  for (var productId in sessions.cart) {
    arrBook.push({bookId: productId, amount: sessions.cart[productId]});
  }
  
  // db.get('transactions').push({ id: id, idUser: user.id, idBooks: arrBook, isComplete: false}).write();
  // db.get('sessions').find({id: sessionId}).assign({ cart:  {}}).write();

  var newTran = new Transaction({
    idUser: user.id,
    idBooks: arrBook,
    isComplete: false,
  });
  await newTran.save();

  await Session.findById(sessionId, function(err, doc) {
    doc.cart = {}
    doc.save();
  });

  res.redirect('/cart');
}