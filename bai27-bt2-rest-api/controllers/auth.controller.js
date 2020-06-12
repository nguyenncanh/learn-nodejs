//var md5 = require('md5');
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
//const db = require("../db");
var User = require('../models/user.model');

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