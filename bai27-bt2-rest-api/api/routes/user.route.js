var express = require('express');
var multer = require('multer');
var router = express.Router();

var controller = require('../controllers/user.controller');
var validate = require('../../validates/user.validate');

var upload = multer({ dest: './public/uploads/' });


router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/:id/view', controller.view);

router.delete('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.put('/:id/update', controller.postUpdate);

// tên avatar phải giống với attribute name=avatar bên form input
router.post('/create',
    upload.single('avatar'),
    validate.postCreate,
    controller.postCreate
);

router.get('/profile', controller.profile)

router.put('/profile', controller.updateProfile)

router.get('/profile/avatar', controller.avatar)

router.put('/profile/avatar',
    upload.single('avatar'),
    controller.updateAvatar
);

router.put('/changePassword', controller.changePassword)

module.exports = router;