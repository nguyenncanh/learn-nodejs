// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
app.set("view engine", "pug");
app.set('views', './views')

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  res.render("todos/index", {todos: [
      {id: 1, content: 'Đi chợ'},
      {id: 1, content: 'Nấu cơm'},
      {id: 1, content: 'Rửa bát'},
      {id: 1, content: 'Học code tại CodersX'},
    ]
  });
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
