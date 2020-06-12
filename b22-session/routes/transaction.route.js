var express = require('express');
var router = express.Router();

const controller = require('../controllers/transaction.controller');

router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/:id/view', controller.view);

router.get('/:id/delete', controller.delete);

router.get('/:id/:idbook/deleteBook', controller.deleteBook);

router.get('/create', controller.create);

router.get('/:id/complete', controller.complete);

router.post('/create', controller.postCreate);

module.exports = router;