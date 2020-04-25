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
db.defaults({ todos: []})
  .write()

app.set("view engine", "pug");
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  res.render("todos/index", {todos: db.get('todos').value()});
});

app.get('/todos/search', function(req, res) {
  var q = req.query.q;
  var macthTodos = db.get('todos').value().filter(function(todo) {
    return todo.text.toLowerCase().indexOf(q.toLowerCase()) != -1;
  });
  
  res.render('todos/index', 
             { todos: macthTodos,
                searchValue : q
                                });
});

app.get('/todos/create', function(req, res){
  res.render('todos/create');
});

app.get('/todos/:id', function(req, res) {
  var id = req.params.id;
  
  var todo = db.get('todos').find({id: id}).value();
  
  res.render('todos/view', {
    todo: todo
  });
});

app.get('/todos/:id/delete', function(req, res) {
  var id = req.params.id;
  
  var todo = db.get('todos').find({id: id}).value();
  var pos = db.get('todos').value().findIndex((x) => {
    return x.id = todo.id;
  });
  
  db.get('todos').value().splice(pos, 1);
  res.redirect('/todos');
});

app.post('/todos/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('todos').push(req.body).write();
  res.redirect('/todos');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
