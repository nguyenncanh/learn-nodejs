var express = require('express');
var router = express.Router();

var controller = require('../controllers/shop.controller');
var validate = require('../validates/shop.validate');
var authMiddleware = require("../middlewares/auth.middleware");

router.get('/', controller.getShops);

router.get('/registerShop',
            authMiddleware.requireAuth,
            controller.registerShopPage)

router.post('/registerShop', 
            validate.registerShop, 
            controller.registerShop)

router.get('/:id/books', controller.getBooksShop)

module.exports = router;