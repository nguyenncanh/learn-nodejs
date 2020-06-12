// const db = require('../db');
// const shortid = require('shortid');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
var cloudinary = require("cloudinary").v2;
const fs = require('fs');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports.getUsers = async (req, res) => {
    var users = await User.find();
    if (!req.query.q) {
        var cookieUser = req.signedCookies.userId;
        var user = await User.findOne({ _id: cookieUser });
        if (user.isAdmin === true) {
            return res.status(200).json({ users: users });
        }
    } else {
        var q = req.query.q;
        var macthUsers = users.filter(function (user) {
            return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
        });

        return res.status(200).json({
            users: macthUsers,
            searchValue: q
        });
    }
    
};

module.exports.getUser = async function (req, res) {
    if (req.params.id) {
        var id = req.params.id;
    } else {
        var id = req.signedCookies.userId;
    }
    var user = await User.findOne({ _id: id });

    return res.status(200).json({
        user: user
    });
};

module.exports.deleteUser = async function (req, res) {
    var id = req.params.id;
    await User.findByIdAndRemove(id).exec();

    return res.status(200).json('Delete success!');
};

module.exports.updateUser = async function (req, res) {
        var idUser = req.params.id;
        await User.findById(idUser, function (err, doc) {
            doc.name = req.body.name;
            doc.phone = req.body.phone;
            doc.email = req.body.email;
            doc.save();
        });

        return res.status(200).json('Update success!');
};

module.exports.createUser = async function (req, res) {
    var hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));
    var path = '';
    if (!req.file) {
        path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
    } else {
        path = await cloudinary.uploader.upload(req.file.path).then(doc => doc.url)
    }

    var newUser = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: hashPassword,
        avatar: path,
        isAdmin: false
    });
    await newUser.save();

    // xóa file ảnh để ko phải lưu trong file upload
    if (req.file) {
        fs.unlinkSync(req.file.path);
    }

    return res.status(200).json({message: 'Create success!'});
};

module.exports.updateAvatar = async function (req, res) {
    var id = req.signedCookies.userId;
    var path = '';
    if (!req.file) {
        path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
    } else {
        path = await cloudinary.uploader.upload(req.file.path).then(doc => doc.url)
    }

    await User.findById(id, function (err, doc) {
        doc.avatar = path;
        doc.save();
    });

    if (req.file) {
        fs.unlinkSync(req.file.path);
    }

    return res.status(200).json('Update success!');
}

module.exports.changePassword = async function (req, res) {
    var id = req.signedCookies.userId;
    var oldPass = req.body.oldPass;
    var newPass = req.body.newPass;
    var confirmPass = req.body.confirmPass;

    var user = await User.findById(id);

    if (bcrypt.compareSync(oldPass, user.password) === true) {
        if (newPass === confirmPass) {
            var hashNewPass = bcrypt.hashSync(newPass, bcrypt.genSaltSync(12));
            await User.findById(id, function (err, doc) {
                doc.password = hashNewPass;
                doc.save();
            });

            return res.status(200).json("Change password success!");
        } else {
            return res.status(400).json({
                message: "The confirm password is not the same as the new password",
                values: req.body
            })
        }
    } else {
        return res.status(400).json({
            message: "Wrong password",
            values: req.body
        })
    } 
}