//var md5 = require('md5');
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
//const db = require("../db");
var User = require('../models/user.model');
const fs = require('fs');
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  // var user = db
  //   .get("users")
  //   .find({ email: email })
  //   .value();
  var user = await User.findOne({email: email});

  if (!user) {
    res.render("auth/login", {
      errors: ["User does not exist."],
      values: req.body
    });
    return;
  }

  // dùng md5 package mã hóa password
  //var hashedPassword = md5(password);
  //  try {
  if (user.wrongLoginCount < 3) {
    if (bcrypt.compareSync(password, user.password) === false) {
      if (user.wrongLoginCount === 0) {
        // db.get("users")
        //   .find({ email: email })
        //   .set({ "user.wrongLoginCount": 1 })
        //   .write();
        await User.findOneAndUpdate(
          { email: email },
          { $set: {wrongLoginCount: 1} }
        )

        res.render("auth/login", {
          errors: ["Wrong password."],
          values: req.body
        });
        return;
      } else if (user.wrongLoginCount < 3 && user.wrongLoginCount > 0) { 

        // db.get("users")
        //   .find({ email: email })
        //   .set({ users: user })
        //   .write();
        await User.findOneAndUpdate(
            { email: email }, 
            { $set: { wrongLoginCount: user.wrongLoginCount + 1 } }
          );
        
        res.render("auth/login", {
          errors: ["Wrong password."],
          values: req.body
        });
        return;
      }
    } else {
      await User.findOneAndUpdate(
        { email: email },
        { $set: { wrongLoginCount: 0 } }
      );
    }

    res.cookie('userId', user._id, {signed: true});
    res.redirect("/");
  } else {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "canhzone861998@gmail.com",
      subject: "Login failed",
      text: "We noticed you logged in multiple times but failed.",
      html: "<strong>We noticed you logged in multiple times but failed.</strong>"
    };
    sgMail.send(msg);
    res.render("auth/login", {
          error: "The account is temporarily locked because you have logged in more than 3 times",
          values: req.body
        });
  }
};

module.exports.logout = function(req, res) {
  res.clearCookie('userId');
  res.clearCookie('sessionId');
  res.redirect('/');
}

module.exports.register = async function(req, res) {
  var { name, phone, email, password, confirmPass} = req.body;
  if (password !== confirmPass) {
    res.render('auth/register', {
      errors: ['The confirm password is not the same as the password']
    });
  } else {
    var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    var path = "";

    if (!req.file) {
      path = "https://cdn.glitch.com/42d1b825-d513-481d-8f96-88869ec4cec7%2Favatar_defaul.png?v=1589035529595";
    } else {
      path = await cloudinary.uploader.upload(req.file.path).then(doc => doc.url)
    }

    var newUser = new User({
        name: name,
        phone: phone,
        email: email,
        password: hashPassword,
        avatar: path,
        isAdmin: false
    });
    await newUser.save();

    // xóa file ảnh để ko phải lưu trong file upload
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.render('auth/register', {
      message: "Register success!. Now you can login."
    });
  }
}

module.exports.registerPage = function(req, res) {
  res.render('auth/register');
}