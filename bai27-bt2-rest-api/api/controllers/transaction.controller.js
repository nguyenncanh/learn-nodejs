var Transaction = require('../../models/transaction.model');
var Book = require('../../models/book.model');
var User = require('../../models/user.model');

module.exports.index = async (req, res) => {
    try {
        var cookieUser = req.signedCookies.userId;

        var transaction = await Transaction.findOne({ $and: [{ idUser: cookieUser }, { isComplete: false }] });

        var transactions = await Transaction.find();

        var user = await User.findById(cookieUser);

        var users = await User.find();

        var books = await Book.find();

        if (user.isAdmin === true) {
            if (!transactions) {
                throw new Error("There are currently no transactions");
            } else {
                return res.status(200).json({
                    transactions: transactions,
                    users: users,
                    books: books});
            }
        } else {
            if (!transaction) {
                throw new Error("You have no transactions yet");
            } else {
                return res.status(200).json({
                    transactions: transaction,
                    users: user,
                    books: books});
            }
        }
    } catch ({ message = "Invalid Required" }) {
        res.status(400).json({ message })
    }
};

module.exports.search = async function (req, res) {
    var q = req.query.q.trim();

    var users = await User.find();

    var books = await Book.find();

    // Lấy danh sách user thông qua dữ liệu tìm kiếm
    var matchUsers = users.filter(function (user) {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });

    // Tìm transaction tương ứng với các user đã tìm ở trên
    var matchTrans = [];
    for (var i = 0; i < matchUsers.length; i++) {
        var transTarget = await Transaction.findOne({ $and: [{ idUser: matchUsers[i]._id }, { isComplete: false }] });
        if (transTarget !== null) {
            matchTrans.push(transTarget);
        }
    }

    return res.status(200).json({
        transactions: matchTrans,
        users: users,
        books: books,
        searchValue: q
    });
};

module.exports.view = async function (req, res) {
    var id = req.params.id;

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

    return res.status(200).json({
        user: user.name,
        books: arrBooksName
    });
};

module.exports.delete = async function (req, res) {
    var id = req.params.id;

    await Transaction.findByIdAndRemove(id).exec();

    return res.status(200).json({message: 'Delete success!'});
};

module.exports.deleteBook = async function (req, res) {
    var id = req.params.id;
    var idBook = req.params.idbook;
    var trans = await Transaction.findById(id);

    // Tìm vị trí idBook trong arr trans.idBooks
    var pos = trans.idBooks.findIndex(x => {
        return x === idBook;
    });
    // Xóa idBook
    trans.idBooks.splice(pos, 1);

    // kiểm tra nếu lần xóa này chỉ còn 1 cuốn sách thì xóa lun transaction
    if (trans.idBooks.length === 0) {
        await Transaction.findByIdAndRemove(id);
    } else {
        await Transaction.findById(id, function (err, doc) {
            doc.idBooks = trans.idBooks;
            doc.save();
        });
    }
    return res.status(200).json({message: "Delete success!"});
};

module.exports.complete = async function (req, res) {
    var id = req.params.id;

    var transactions = await Transaction.find();
    var users = await User.find();
    var books = await Book.find();
    var trans = await Transaction.findById(id);

    var error;
    if (!trans) {
        return res.json({
            error: "The transaction does not exist.",
            transactions: transactions,
            users: users,
            books: books});
    }
    await Transaction.findById(id, function (err, doc) {
        doc.isComplete = true;
        doc.save();
    })

    return res.status(200).json("Complete success!");
};

module.exports.create = async function (req, res) {
    var users = await User.find();
    var books = await Book.find();
    return res.json({ users: users, books: books });
};

module.exports.postCreate = async function (req, res) {
    var userName = req.body.user;
    var bookTitle = req.body.books;
    var arrUsers = await User.find();
    var arrBooks = await Book.find();
    var arrTrans = await Transaction.find();

    // chuyển tên user thành id user
    var user = arrUsers.find(x => {
        return x.name === userName;
    });
    var idUser = user._id;

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
        idBooks.push(books._id);
    } else {
        for (var i = 0; i < bookTitle.length; i++) {
            var book = arrBooks.find(x => {
                return x.title === bookTitle[i];
            });
            idBooks.push(book._id);
        }
    }

    if (oldTrans && oldTrans.isComplete === false) {
        await Transaction.findById(oldTrans._id, function (err, doc) {
            doc.idBooks = idBooks;
            doc.save();
        });
    } else {
        var newTran = new Transaction({
            idUser: idUser,
            idBooks: idBooks,
            isComplete: false
        });

        await newTran.save();
    }
    res.status(200).json("Create success!");
};