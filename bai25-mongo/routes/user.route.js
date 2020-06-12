var express = require('express');
var multer  = require('multer');
var router = express.Router();

var controller = require('../controllers/user.controller');
var validate = require('../validates/user.validate');

var cookies = require('../cookie/cookie.middleware');

var upload = multer({ dest: './public/uploads/' });


router.get("/", controller.index);

router.get('/search', controller.search);

router.get('/:id/view', controller.view);

router.get('/:id/delete', controller.delete);

router.get('/:id/update', controller.update);

router.post('/:id/update', controller.postUpdate);

router.post('/:id/update', controller.postUpdate);

router.get('/create', controller.create);

// tên avatar phải giống với attribute name=avatar bên form input
router.post('/create', 
            upload.single('avatar'), 
            validate.postCreate, 
            controller.postCreate
           );

router.get('/profile', controller.profile)

router.post('/profile', controller.updateProfile)

router.get('/profile/avatar', controller.avatar)

router.post('/profile/avatar', 
            upload.single('avatar'), 
            controller.updateAvatar
           );

router.post('/changePassword', controller.changePassword)

module.exports = router;