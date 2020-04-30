// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const userRoute = require('./routes/user.route');
const bookRoute = require('./routes/book.route');
const transRoute = require('./routes/transaction.route');

app.set("view engine", "pug");
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render("index");
});

// -------------------------------------------------------------
// book
app.use('/books', bookRoute);

// -------------------------------------------------------------
// user
app.use('/users', userRoute);

// -------------------------------------------------------------
// transaction
app.use('/transactions', transRoute);
// listen for requests :)
app.listen(3000, () => {
  console.log("Server listening on port " + 3000);
});
