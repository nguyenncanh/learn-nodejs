// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const express = require("express");
var PORT = process.env.PORT || 3000;
const app = express();
var cookieParser = require("cookie-parser");
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
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
const shopRoute = require("./routes/shop.route");

var apiAuthRoute = require("./api/routes/auth.route");
var apiTransactionsRoute = require("./api/routes/transaction.route");
var apiBooksRoute = require("./api/routes/book.route");
var apiUsersRoute = require("./api/routes/user.route");
var apiProductsRoute = require("./api/routes/product.route");
var apiCartsRoute = require("./api/routes/cart.route");

var authMiddleware = require("./middlewares/auth.middleware");
var sessionMiddleware = require("./middlewares/session.middleware");
var cartMiddleware = require("./middlewares/cart.middleware");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// chuyển 1 chuổi secret
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static("public"));

app.use('/api/transactions', apiTransactionsRoute);
app.use('/api/books', apiBooksRoute);
app.use('/api/users', apiUsersRoute);
app.use('/api/products', apiProductsRoute);
app.use('/api/carts', apiCartsRoute);
app.use('/api', apiAuthRoute); 

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

// shop
app.use('/shops', shopRoute);

// listen for requests :)
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
