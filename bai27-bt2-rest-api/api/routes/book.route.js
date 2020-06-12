var express = require('express');
var router = express.Router();
var multer = require('multer');

const controller = require('../controllers/book.controller');
var validate = require('../../validates/book.validate');
var upload = multer({ dest: './public/uploads/' });

router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/:id/view', controller.view);

router.delete('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.put('/:id/update', controller.postUpdate);

router.post('/create',
    upload.single('avatar'),
    validate.postCreate,
    controller.postCreate
);

module.exports = router;