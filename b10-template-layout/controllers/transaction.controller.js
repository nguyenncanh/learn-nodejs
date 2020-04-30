const db = require('../db');
const shortid = require('shortid');

module.exports.index = (req, res) => {
  var transactions = db.get('transactions').value();
  var users = db.get('users').value();
  var books = db.get('books').value();
  res.render("transactions/index", {transactions: transactions, users: users, books: books});
};

module.exports.search = function(req, res) {
  var q = req.query.q.trim();
  var users = db.get('users').value();
  var books = db.get('books').value();

  // Lấy danh sách user thông qua dữ liệu tìm kiếm
  var matchUsers = users.filter(function (user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });

  // Tìm transaction tương ứng với các user đã tìm ở trên
  var matchTrans = [];
  for (var i = 0; i < matchUsers.length; i++) {
    var transTarget = db.get('transactions').value().find((x) => {
      return x.idUser === matchUsers[i].id;
    });
    matchTrans.push(transTarget);
  }

  res.render('transactions/index', 
    {
      transactions: matchTrans,
      users: users,
      books: books,
      searchValue : q
    });
};

module.exports.view = function(req, res) {
  var id = req.params.id;
  var users = db.get('users').value();
  var books = db.get('books').value();
  var trans = db.get('transactions').find({id: id}).value();
  // Lấy obj user để lấy tên user
  var user = users.find((x) => {
    return x.id === trans.idUser;
  });

  // Lấy tên book push vào arr arrBooksName
  var arrBooksName = [];
  for(var i = 0; i < trans.idBooks.length; i++) {
    var book = books.find((x) => {
      return x.id === trans.idBooks[i];
    });
    arrBooksName.push(book.title);
  }

  res.render('transactions/view', {
    user: user.name,
    books: arrBooksName
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.id;
  
  var trans = db.get('transactions').find({id: id}).value();
  db.get('transactions').remove(trans).write();
  res.redirect('/transactions');
}

module.exports.deleteBook = function(req, res) {
  var id = req.params.id;
  var idBook = req.params.idbook;
  var trans = db.get('transactions').find({id: id}).value();
  // Tìm vị trí idBook trong arr trans.idBooks
  var pos = trans.idBooks.findIndex((x) => {
        return x === idBook;
  });
  // Xóa idBook
  trans.idBooks.splice(pos, 1);

  // kiểm tra nếu lần xóa này chỉ còn 1 cuốn sách thì xóa lun transaction
  if (trans.idBooks.length === 0) {
    db.get('transactions').remove(trans).write();
  } else {
    db.get('transactions').find({ id: id }).set('idBooks', trans.idBooks).write();
  }
  res.redirect('/transactions');
};

module.exports.complete = function(req, res) {
  var id = req.params.id
  // set lại thuộc tính isComplete từ false sang true
  db.get('transactions').find({id: id}).set('isComplete', true).write();
  res.redirect('/transactions');
};

module.exports.create = function(req, res){
  var users = db.get('users').value();
  var books = db.get('books').value();
  res.render('transactions/create', {users: users, books: books});
};

module.exports.postCreate = function(req, res) {
  var userName = req.body.user;
  var bookTitle = req.body.books;
  var arrUsers = db.get('users').value();
  var arrBooks = db.get('books').value();
  var arrTrans = db.get('transactions').value();
  
  // chuyển tên user thành id user
  var user = arrUsers.find((x) => {
    return x.name === userName;
  })
  var idUser = user.id;
  
  // tìm trans cũ của user vừa nhập
  var oldTrans = arrTrans.find((tran) => {
    return tran.idUser === idUser;
  });
  
  // chuyển tên book thành id book
  var idBooks = [];
  if (typeof (bookTitle) === 'string') {
    var books = arrBooks.find((x) => {
      return x.title === bookTitle;
    });
    idBooks.push(books.id);
  } else {
    for (var i = 0; i < bookTitle.length; i++) {
      var book = arrBooks.find((x) => {
        return x.title === bookTitle[i];
      });
      idBooks.push(book.id);
    }
  }
  
  if (oldTrans && oldTrans.isComplete === false) {
    // set lại dữ liệu idBook mới khi user đã tồn tại trong Transactions db
    db.get('transactions').find({id: oldTrans.id}).set('idBooks', idBooks).write();
  } else {
    // Tạo mới trans khi user chưa có trong Transactions db
    req.body.id = shortid.generate();
    req.body.isComplete = false;
    db.get('transactions').push({id: req.body.id, idUser: idUser, idBooks: idBooks, isComplete: req.body.isComplete}).write();
  }
  res.redirect('/transactions');
};