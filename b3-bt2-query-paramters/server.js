// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var todos = [
      {id: 1, todo: 'Đi chợ'},
      {id: 1, todo: 'Nấu cơm'},
      {id: 1, todo: 'Rửa bát'},
      {id: 1, todo: 'Học code tại CodersX'},
    ];

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  res.render("todos/index", { todos: todos});
});

app.get('/todos/search', function(req, res) {
  var q = req.query.q;
  var macthTodos = todos.filter(function(todo) {
    return todo.content.toLowerCase().indexOf(q.toLowerCase()) != -1;
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
  todos.push(req.body);
  res.redirect('/todos');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
