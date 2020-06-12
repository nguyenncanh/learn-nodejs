// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var cookieParser = require('cookie-parser');
const userRoute = require('./routes/user.route');
const bookRoute = require('./routes/book.route');
const transRoute = require('./routes/transaction.route');
const authRoute = require('./routes/auth.route');

var authMiddleware = require('./middlewares/auth.middleware');

app.set("view engine", "pug");
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// chuyển 1 chuổi secret
app.use(cookieParser('h2398ruqhoadas'))
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", authMiddleware.requireAuth, (request, response) => {
  response.render("index");
});

// -------------------------------------------------------------
// book
app.use('/books', authMiddleware.requireAuth, bookRoute);

// -------------------------------------------------------------
// user
app.use('/users', authMiddleware.requireAuth, userRoute);

// -------------------------------------------------------------
// transaction
app.use('/transactions', authMiddleware.requireAuth, transRoute);

// auth
app.use('/auth', authRoute);

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
