// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const express = require("express");

const app = express();
var cookieParser = require("cookie-parser");
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(_ => console.log('mongodb connected'));

const User = require('./models/user.model')
const userRoute = require("./routes/user.route");
const bookRoute = require("./routes/book.route");
const transRoute = require("./routes/transaction.route");
const authRoute = require("./routes/auth.route");
const productsRoute = require("./routes/products.route");
const cartRoute = require("./routes/cart.route");

var authMiddleware = require("./middlewares/auth.middleware");
var sessionMiddleware = require("./middlewares/session.middleware");
var cartMiddleware = require("./middlewares/cart.middleware");
const db = require('./db');

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// chuyển 1 chuổi secret
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static("public"));

// kiểm tra và tạo sessionId khi mở bất kì trang nào
app.use(sessionMiddleware);
// truyền dữ liệu sessions lên các trang
app.use(cartMiddleware);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/",async (req, response) => {
  var user = await User.findOne({_id: req.signedCookies.userId})
  response.render("index", {user: user});
});

// -------------------------------------------------------------
// book
app.use("/books", authMiddleware.requireAuth, bookRoute);

// -------------------------------------------------------------
// user
app.use("/users", authMiddleware.requireAuth, userRoute);

// -------------------------------------------------------------
// transaction
app.use("/transactions", authMiddleware.requireAuth, transRoute);

// products
app.use("/products", productsRoute);

// auth
app.use("/auth", authRoute);

// cart
app.use("/cart", cartRoute);

// listen for requests :)
app.listen(3000, () => {
  console.log("Server listening on port " + 3000);
});
