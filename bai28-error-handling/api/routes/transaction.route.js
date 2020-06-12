var express = require('express');
var router = express.Router();

const controller = require('../controllers/transaction.controller');

router.get("/", controller.getTransactions);

router.get('/:id', controller.getTransaction);

router.delete('/:id', controller.deleteTransaction);

router.delete('/:id/:idbook', controller.deleteBook);

router.get('/createPage', controller.getUserAndBook);

router.put('/:id/complete', controller.complete);

router.post('/', controller.createTransaction);

module.exports = router;