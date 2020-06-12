var express = require('express');
var router = express.Router();

const controller = require('../controllers/transaction.controller');

router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/:id/view', controller.view);

router.delete('/:id/delete', controller.delete);

router.delete('/:id/:idbook/deleteBook', controller.deleteBook);

router.get('/create', controller.create);

router.put('/:id/complete', controller.complete);

router.post('/create', controller.postCreate);

module.exports = router;