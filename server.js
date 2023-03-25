const express = require('express');
const app = express();
const environment = require('dotenv').config();

// app.get('/', (req, res) => {
//   res.send('Hello World 1!');
// });


var todos = [{
    id: 1,
    description: 'Eat Lunch',
    compelted: false
},{
    id: 2,
    description: 'Go to Store',
    compelted: false
}]

app.get('/', function(req,res){
    res.send('fbSTATS')
});

//GET /todos
app.get('/api/todos', function(req,res){
    res.json(todos);
});

//GET /todos/:id
app.get('/api/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    todos.forEach(function(todo){
        if (todoId === todo.id) {
            matchedTodo = todo
        }
    })
    
    if (matchedTodo){
        res.json(matchedTodo);    
    } else {
        res.status(404).send();
    }
    
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(process.env.PORT);
  console.log(process.env.NODE_ENV);
});