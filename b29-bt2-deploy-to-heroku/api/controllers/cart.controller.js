var Session = require('../../models/session.model');
var Book = require('../../models/book.model');
var Transaction = require('../../models/transaction.model');
var User = require('../../models/user.model');

module.exports.addToCart = async function (req, res, next) {
    try {
        var productId = req.params.productId;
        var sessionId = req.signedCookies.sessionId;

        if (!sessionId) {
            throw new Error("Server haven't sessionID");
        }

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
        return res.status(200).json("Add success!");
    } catch ({message = "Invalid"}) {
        return res.status(400).json({message});
    }
}

module.exports.index = async function (req, res) {
    try {
        var sessionId = req.signedCookies.sessionId;

        var sessions = await Session.findById(sessionId);
        var books = await Book.find();

        var arrBookName = [];
        for (var productId in sessions.cart) {
            var bookName = books.find((book) => {
                return productId === book.id;
            });
            arrBookName.push(bookName);
        };

        if (!arrBookName.length) {
            throw new Error("No book in Cart");
        } else {
            return res.status(200).json({
                sessions: sessions,
                books: arrBookName
            });
        }
    } catch({message = "Invalid"}) {
        res.status(400).json({message});
    }
}

module.exports.rent = async function (req, res) {
    var sessionId = req.signedCookies.sessionId;
    var userId = req.signedCookies.userId;

    var sessions = await Session.findById(sessionId);
    var user = await User.findById(userId);

    var arrBook = [];
    for (var productId in sessions.cart) {
        arrBook.push({ bookId: productId, amount: sessions.cart[productId] });
    }

    var newTran = new Transaction({
        idUser: user.id,
        idBooks: arrBook,
        isComplete: false,
    });
    await newTran.save();

    await Session.findById(sessionId, function (err, doc) {
        doc.cart = {}
        doc.save();
    });

    return res.status(200).json("Rent success!");
}