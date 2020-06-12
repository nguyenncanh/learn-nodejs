const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
var User = require("../../models/user.model");

module.exports.login = (req, res) => {
    res.render("auth/login");
};

module.exports.postLogin = async function (req, res) {
    const { email, password } = req.body;
    try{
        var user = await User.findOne({ email: email });
        console.log('us1', user)
        if (!user) {
            // return res.json({ errors: "User does not exist." })
            throw new Error('User does not exist.')
        }

        if (user.wrongLoginCount < 3) {
            if (bcrypt.compareSync(password, user.password) === false) {
                if (user.wrongLoginCount === 0) {

                    await User.findOneAndUpdate(
                        { email: email },
                        { $set: { wrongLoginCount: 1 } }
                    );

                    // res.json({ errors: "Wrong password." })
                    throw new Error("Wrong password.")
                } else if (user.wrongLoginCount < 3 && user.wrongLoginCount > 0) {
                    await User.findOneAndUpdate(
                        { email: email },
                        { $set: { wrongLoginCount: user.wrongLoginCount + 1 } }
                    );

                    // return res.json({ errors: "Wrong password." });
                    throw new Error("Wrong password")
                }
            } else {
                const user = await User.findOneAndUpdate(
                    { email: email },
                    { $set: { wrongLoginCount: 0 } }
                );

                // res.cookie("userId", user._id, { signed: true });
                // res.redirect("/");
                return res.status(200).cookie("userId", user._id, { signed: true }).json({ message: "Login Success!", user })
            }

        } else {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "canhzone861998@gmail.com",
                subject: "Login failed",
                text: "We noticed you logged in multiple times but failed.",
                html:
                    "<strong>We noticed you logged in multiple times but failed.</strong>"
            };
            sgMail.send(msg);

            throw new Error("The account is temporarily locked because you have logged in more than 3 times")
            // return res.status(400).json({
            //     error: "The account is temporarily locked because you have logged in more than 3 times",
            //     values: req.body
            // });
        }
    } catch({ message = "Invalid Required" }){
        res.status(400).json({ message })
    }
};