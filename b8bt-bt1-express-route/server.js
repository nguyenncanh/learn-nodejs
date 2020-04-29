// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const shortid = require('shortid');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [], users: []})
  .write()

app.set("view engine", "pug");
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render("index");
});

app.get("/books", (req, res) => {
  res.render("books/index", {books: db.get('books').value()});
});

app.get('/books/search', function(req, res) {
  var q = req.query.q;
  var macthBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('books/index', 
             { books: macthBooks,
                searchValue : q
                                });
});

app.get('/books/create', function(req, res){
  res.render('books/create');
});

app.get('/books/:id/view', function(req, res) {
  var id = req.params.id;
  
  var book = db.get('books').find({id: id}).value();
  res.render('books/view', {
    book: book
  });
});

app.get('/books/:id/delete', function(req, res) {
  var id = req.params.id;
  
  var book = db.get('books').find({id: id}).value();
  db.get('books').remove(book).write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  
  //db.get('books').value().splice(pos, 1);
  res.redirect('/books');
});

app.get('/books/:id/update', function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  var book = db.get('books').find({id: id}).value();
  res.render('books/update', {
    book : book
  });
  // Cập nhật
  app.post('/books/:id/update', function(req, res) {
    db.get('books')
    .find({ id: req.params.id })
    .assign(req.body)
    .write();
    res.redirect('/books');
  });
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
});

app.post('/books/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

// --------------------------------------------------------------
// user
app.get("/users", (req, res) => {
  res.render("users/index", {users: db.get('users').value()});
});

app.get('/users/search', function(req, res) {
  var q = req.query.q;
  var macthUsers = db.get('users').value().filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('users/index', 
             { users: macthUsers,
                searchValue : q
                                });
});

app.get('/users/create', function(req, res){
  res.render('users/create');
});

app.get('/users/:id/view', function(req, res) {
  var id = req.params.id;
  
  var user = db.get('users').find({id: id}).value();
  res.render('users/view', {
    user: user
  });
});

app.get('/users/:id/delete', function(req, res) {
  var id = req.params.id;
  
  var user = db.get('users').find({id: id}).value();
  db.get('users').remove(user).write();
  //var pos = db.get('books').value().findIndex((x) => {
  //  return x.id = book.id;
  //});
  
  //db.get('books').value().splice(pos, 1);
  res.redirect('/users');
});

app.get('/users/:id/update', function(req, res) {
  var id = req.params.id;
  // Hiện nội dung book vào form input 
  var user = db.get('users').find({id: id}).value();
  res.render('users/update', {
    user : user
  });
  // Cập nhật
  app.post('/users/:id/update', function(req, res) {
    db.get('users')
    .find({ id: req.params.id })
    .assign(req.body)
    .write();
    res.redirect('/users');
  });
  //var pos = db.get('books').value().findIndex((x) => {
    //return x.id = book.id;
  //});
  //db.get('books').value().splice(pos, 1, req.body).write();
});

app.post('/users/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
  res.redirect('/users');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
