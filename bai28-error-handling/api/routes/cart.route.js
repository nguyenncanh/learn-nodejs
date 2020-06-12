var express = require('express');
var router = express.Router();

var controller = require('../controllers/cart.controller');
var authMiddleware = require("../../middlewares/auth.middleware");

router.get("/add/:productId", controller.addToCart);

router.get('/', controller.index);

router.post('/rent', authMiddleware.requireAuth, controller.rent);

module.exports = router;