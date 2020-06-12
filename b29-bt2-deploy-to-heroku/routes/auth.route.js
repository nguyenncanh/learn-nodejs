var express = require('express');
var multer = require('multer');
var router = express.Router();

var controller = require('../controllers/auth.controller');
var validate = require('../validates/user.validate');
var upload = multer({ dest: './public/uploads/' });

router.get('/login', controller.login);

router.post('/login', controller.postLogin)

router.get('/logout', controller.logout)

router.get('/register', controller.registerPage)

router.post('/register', 
    upload.single('avatar'), 
    validate.createUser,
    controller.register);

module.exports = router;