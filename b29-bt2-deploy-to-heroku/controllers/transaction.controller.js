//const db = require("../db");
//const shortid = require("shortid");
var Transaction = require('../models/transaction.model');
var Book = require('../models/book.model');
var User = require('../models/user.model');

module.exports.index = async (req, res) => {
  var cookieUser = req.signedCookies.userId;
  //lowdb
  // var transaction = db
  //   .get("transactions")
  //   .find({ idUser: cookieUser, isComplete: false })
  //   .value();
  // var transactions = db.get("transactions").value();
  // var user = db
  //   .get("users")
  //   .find({ id: cookieUser })
  //   .value();
  // var users = db.get("users").value();
  // var books = db.get("books").value();

  //mongoose
  var transaction = await Transaction.findOne({$and: [{idUser: cookieUser}, {isComplete: false}]});

  var transactions = await Transaction.find();

  var user = await User.findById(cookieUser);

  var users = await User.find();

  var books = await Book.find();

  if (user.isAdmin === true) {
    if (!transactions) {
      res.render("transactions/index", {
        errors: ["There are currently no transactions"]
      });
      return;
    } else {
      res.render("transactions/index", {
        transactions: transactions,
        users: users,
        books: books
      });
    }
  } else {
    if (!transaction) {
      res.render("transactions/index", {
        errors: ["You have no transactions yet"]
      });
      return;
    } else {
      res.render("transactions/index", {
        transactions: transaction,
        users: user,
        books: books
      });
    }
  }
};

module.exports.search = async function(req, res) {
  var q = req.query.q.trim();
  // var users = db.get("users").value();
  // var books = db.get("books").value();

  var users = await User.find();

  var books = await Book.find();

  // Lấy danh sách user thông qua dữ liệu tìm kiếm
  var matchUsers = users.filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });

  // Tìm transaction tương ứng với các user đã tìm ở trên
  var matchTrans = [];
  for (var i = 0; i < matchUsers.length; i++) {
    // var transTarget = db
    //   .get("transactions")
    //   .value()
    //   .find(x => {
    //     return x.idUser === matchUsers[i].id;
    //   });
    var transTarget = await Transaction.findOne({$and: [{idUser : matchUsers[i]._id}, {isComplete: false}]});
    if (transTarget !== null) {
      matchTrans.push(transTarget); 
    }
  }

  res.render("transactions/index", {
    transactions: matchTrans,
    users: users,
    books: books,
    searchValue: q
  });
};

module.exports.view = async function(req, res) {
  var id = req.params.id;
  
  //lowdb
  // var users = db.get("users").value();
  // var books = db.get("books").value();
  // var trans = db
  //   .get("transactions")
  //   .find({ id: id })
  //   .value();

  //mongoose
  var users = await User.find();
  var books = await Book.find();
  var trans = await Transaction.findById(id);

  // Lấy obj user để lấy tên user
  var user = users.find(x => {
    return x.id === trans.idUser;
  });

  // Lấy tên book push vào arr arrBooksName
  var arrBooksName = [];
  for (var i = 0; i < trans.idBooks.length; i++) {
    var book = books.find(x => {
      return x.id === trans.idBooks[i];
    });
    arrBooksName.push(book);
  }

  res.render("transactions/view", {
    user: user.name,
    books: arrBooksName
  });
};

module.exports.delete = async function(req, res) {
  var id = req.params.id;

  //lowdb
  // var trans = db
  //   .get("transactions")
  //   .find({ id: id })
  //   .value();
  // db.get("transactions")
  //   .remove(trans)
  //   .write();

  //mongoose
  var trans = await Transaction.findById(id);
  await Transaction.findByIdAndRemove(id).exec();

  res.redirect("/transactions");
};

module.exports.deleteBook = async function(req, res) {
  var id = req.params.id;
  var idBook = req.params.idbook;

  // var trans = db
  //   .get("transactions")
  //   .find({ id: id })
  //   .value();
  var trans = await Transaction.findById(id);

  // Tìm vị trí idBook trong arr trans.idBooks
  var pos = trans.idBooks.findIndex(x => {
    return x === idBook;
  });
  // Xóa idBook
  trans.idBooks.splice(pos, 1);

  // kiểm tra nếu lần xóa này chỉ còn 1 cuốn sách thì xóa lun transaction
  if (trans.idBooks.length === 0) {
    // db.get("transactions")
    //   .remove(trans)
    //   .write();
    await Transaction.findByIdAndRemove(id);
  } else {
    // db.get("transactions")
    //   .find({ id: id })
    //   .set("idBooks", trans.idBooks)
    //   .write();
    await Transaction.findById(id, function(err, doc) {
      doc.idBooks = trans.idBooks;
      doc.save();
    });
  }
  res.redirect("/transactions");
};

module.exports.complete = async function(req, res) {
  var id = req.params.id;

  // var transactions = db.get("transactions").value();
  // var users = db.get("users").value();
  // var books = db.get("books").value();
  // var trans = db
  //   .get("transactions")
  //   .find({ id: id })
  //   .value();
  var transactions = await Transaction.find();
  var users = await User.find();
  var books = await Book.find();
  var trans = await Transaction.findById(id);

  var error;
  if (!trans) {
    error = "The transaction does not exist.";
    res.render("transactions/index", {
      error: error,
      transactions: transactions,
      users: users,
      books: books
    });
    return;
  }
  // set lại thuộc tính isComplete từ false sang true
  // db.get("transactions")
  //   .find({ id: id })
  //   .set("isComplete", true)
  //   .write();
  await Transaction.findById(id, function(err, doc) {
    doc.isComplete = true;
    doc.save();
  })

  res.redirect("/transactions");
};

module.exports.create = async function(req, res) {
  // var users = db.get("users").value();
  // var books = db.get("books").value();
  var users = await User.find();
  var books = await Book.find();
  res.render("transactions/create", { users: users, books: books });
};

module.exports.postCreate = async function(req, res) {
  var userName = req.body.user;
  var bookTitle = req.body.books;
  var arrUsers = await User.find();
  var arrBooks = await Book.find();
  var arrTrans = await Transaction.find();

  // chuyển tên user thành id user
  var user = arrUsers.find(x => {
    return x.name === userName;
  });
  var idUser = user.id;

  // tìm trans cũ của user vừa nhập
  var oldTrans = arrTrans.find(tran => {
    return tran.idUser === idUser && tran.isComplete === false;
  });

  // chuyển tên book thành id book
  var idBooks = [];
  if (typeof bookTitle === "string") {
    var books = arrBooks.find(x => {
      return x.title === bookTitle;
    });
    idBooks.push(books.id);
  } else {
    for (var i = 0; i < bookTitle.length; i++) {
      var book = arrBooks.find(x => {
        return x.title === bookTitle[i];
      });
      idBooks.push(book.id);
    }
  }

  if (oldTrans && oldTrans.isComplete === false) {
    // set lại dữ liệu idBook mới khi user đã tồn tại trong Transactions db
    // db.get("transactions")
    //   .find({ id: oldTrans.id })
    //   .set("idBooks", idBooks)
    //   .write();
    await Transaction.findById(oldTrans.id, function(err, doc) {
      doc.idBooks = idBooks;
      doc.save();
    });
  } else {
    // Tạo mới trans khi user chưa có trong Transactions db
    //req.body.id = shortid.generate();
    //req.body.isComplete = false;
    // db.get("transactions")
    //   .push({
    //     id: req.body.id,
    //     idUser: idUser,
    //     idBooks: idBooks,
    //     isComplete: req.body.isComplete
    //   })
    //   .write();
    var newTran = new Transaction({
      idUser: idUser,
      idBooks: idBooks,
      isComplete: false
    });

    await newTran.save();
  }
  res.redirect("/transactions");
};
