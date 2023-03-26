const express = require('express');
const bodyParser = require('body-parser');
const _ = require ('underscore');
const environment = require('dotenv').config();
const { Pool } = require('pg')


const pool = new Pool()





const app = express();
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());





app.get('/', function(req,res){
    res.send('fbSTATS')
});

//GET /todos
app.get('/api/todos', async function(req,res){
  var queryParams = req.query;
  
  
  // const {filteredTodos} = await pool.query('SELECT * FROM todos');



  // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
  //   filteredTodos = _.where(filteredTodos,{completed: true});
  // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
  //     filteredTodos = _.where(filteredTodos,{completed: false});
  // }

  // if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0){
  //   filteredTodos = _.filter(filteredTodos, function(todo){
  //       return todo.description.toUpperCase().indexOf(queryParams.q.toUpperCase()) > -1;
  //   });
  // }

  // res.json(filteredTodos);x







  pool
    .query('SELECT * FROM todos')
    
    .then((sqlRes) => {
      var filteredTodos = sqlRes.rows;

      if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
          filteredTodos = _.where(filteredTodos,{completed: true});
      } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
          filteredTodos = _.where(filteredTodos,{completed: false});
      }
    
      if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0){
        filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.toUpperCase().indexOf(queryParams.q.toUpperCase()) > -1;
        });
      }

      res.json(filteredTodos);

    })
    
    .catch((err) =>
      setImmediate(() => {
        throw err
      })
    )

  
});

//GET /todos/:id
app.get('/api/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos,{id: todoId});
      
  if (matchedTodo){
      res.json(matchedTodo);    
  } else {
    res.status(404).send({
      "error": "No Todo found with requeted id"
    });
  }
});

//POST /todos
app.post('/api/todos', function(req,res){
    
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
      return res.status(400).send();
  }

  body.id = todoNextId++;
  body.description = body.description.trim();

  todos.push(body);

  res.send(body);
  
});

//DELETE /todos/:id
app.delete('/api/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos,{id: todoId});

  if (!matchedTodo){
      res.status(404).send({
          "error": "No Todo found with requeted id"
      });
  } else {
      todos = _.without(todos, matchedTodo);
      res.json(matchedTodo);
  }

});

//PUT /todos/:id
app.put('/api/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos,{id: todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes ={};

  if (!matchedTodo){
      return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
      validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
      return res.status(400).send({"error":"Invalid Completed"});
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
      validAttributes.description = body.description.trim();
  } else if (body.hasOwnProperty('description')) {
      return res.status(400).send({"error":"Invalid Description"});
  }

  _.extend(matchedTodo, validAttributes);

  res.send(body);

});




const server = app.listen(process.env.PORT || 8080, () => {
  console.log(process.env.PORT);
  console.log(process.env.NODE_ENV);
});