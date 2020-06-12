//var md5 = require('md5');
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const db = require("../db");

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var user = db
    .get("users")
    .find({ email: email })
    .value();
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
  if (user.wrongLoginCount < 3 || user.wrongLoginCount === undefined) {
    if (bcrypt.compareSync(password, user.password) === false) {
      if (user.wrongLoginCount === undefined) {
        user.wrongLoginCount = 1;
        db.get("users")
          .find({ email: email })
          .set({ "user.wrongLoginCount": 1 })
          .write();
        res.render("auth/login", {
          errors: ["Wrong password."],
          values: req.body
        });
        return;
      } else if (user.wrongLoginCount < 3) {
        user.wrongLoginCount += 1;
        db.get("users")
          .find({ email: email })
          .set({ users: user })
          .write();
        console.log(
          db
            .get("users")
            .find({ email: email })
            .value()
        );
        res.render("auth/login", {
          errors: ["Wrong password."],
          values: req.body
        });
        return;
      }
    }

    res.cookie('userId', user.id, {signed: true});
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
