var express = require('express');
var router = express.Router();

var controller = require('../controllers/user.controller');
var validate = require('../validates/user.validate');

var cookies = require('../cookie/cookie.middleware');

router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/create', controller.create);

router.get('/:id/view', controller.view);

router.get('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.post('/:id/update', controller.postUpdate);

router.post('/create', validate.postCreate, controller.postCreate);

module.exports = router;