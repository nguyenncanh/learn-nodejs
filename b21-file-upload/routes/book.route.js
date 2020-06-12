var express = require('express');
var router = express.Router();

const controller = require('../controllers/book.controller');
var validate = require('../validates/book.validate');

router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/create', controller.create);

router.get('/:id/view', controller.view);

router.get('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.post('/:id/update', controller.postUpdate);

router.post('/create', validate.postCreate, controller.postCreate);

module.exports = router;