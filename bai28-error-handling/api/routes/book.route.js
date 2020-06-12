var express = require('express');
var router = express.Router();
var multer = require('multer');

const controller = require('../controllers/book.controller');
var validate = require('../../validates/book.validate');
var upload = multer({ dest: './public/uploads/' });

router.get("/", controller.getBooks);

router.get('/:id', controller.getBook);

router.delete('/:id', controller.deleteBook);

router.put('/:id', controller.updateBook);

router.post('/',
    upload.single('avatar'),
    validate.createBook,
    controller.createBook
);

module.exports = router;