module.exports.registerShop = function (req, res, next) {
    var errors = [];
    if (!req.body.nameShop) {
        errors.push("Shop name is required.");
    }
    if (req.body.nameShop.length > 100) {
        errors.push("The name length cannot exceed 100 characters.")
    }
    if (!req.body.email) {
        errors.push("Email is required.");
    }
    if (errors.length) {
        res.render('shops/registerShop', {
            errors: errors,
            values: req.body
        });
        return;
    }

    next();
}