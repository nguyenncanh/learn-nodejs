var Book = require('../../models/book.model');


module.exports.index = async (req, res) => {
    var products = await Book.find();
    return res.status(200).json({
        products: products
    });
};

module.exports.search = async function (req, res) {
    var q = req.query.q;

    var books = await Book.find();
    var macthBooks = books.filter(function (book) {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });

    return res.status(200).json({ products: macthBooks, searchValue: q });
}
