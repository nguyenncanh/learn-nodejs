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
                res.render("transactions/index", {
                    transactions: transaction,
                    users: user,
                    books: books
                });
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