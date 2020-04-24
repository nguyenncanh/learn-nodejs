// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

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

app.post('/todos/create', function(req, res) {
  db.get('todos').push(req.body).write();
  res.redirect('/todos');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
