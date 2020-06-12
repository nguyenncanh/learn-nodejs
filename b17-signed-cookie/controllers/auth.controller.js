//var md5 = require('md5');
const bcrypt = require("bcrypt");
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
  console.log("users: ", user);
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

      res.cookie("userId", user.id, { maxAge: 3600000, signed: true });
      res.redirect("/");
    } else {
      res.status(404).end();
    }
  
  //}
// catch (error) {}
};
