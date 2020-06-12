module.exports.createUser = function(req, res, next) {
  var errors = [];
  if (!req.body.name) {
    errors.push("Name is required.");
  }
  if (req.body.name.length > 30) {
    errors.push("The name length cannot exceed 30 characters.")
  }
  if (!req.body.phone) {
    errors.push("Phone is required.");
  }
  if (!req.body.email) {
    errors.push("email is required.");
  }
  if (!req.body.password) {
    errors.push("password is required.");
  }
  if (!req.body.confirmPass) {
    errors.push("confirm password is required.");
  }
  if (errors.length) {
    res.render('users/create', {
      errors: errors,
      values: req.body
    });
    return;
  }
  
  next();
}