var express = require('express');
var multer = require('multer');
var router = express.Router();

var controller = require('../controllers/user.controller');
var validate = require('../../validates/user.validate');

var upload = multer({ dest: './public/uploads/' });


router.get("/", controller.getUsers);

router.get('/:id', controller.getUser);

router.delete('/:id', controller.deleteUser);

router.patch('/:id', controller.updateUser);

// tên avatar phải giống với attribute name=avatar bên form input
router.post('/',
    upload.single('avatar'),
    validate.createUser,
    controller.createUser
);

router.put('/profile/updateAvatar',
    upload.single('avatar'),
    controller.updateAvatar
);

router.put('/changePassword', controller.changePassword)

module.exports = router;