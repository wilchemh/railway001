//Declare Module Includes
const express       = require('express');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const environment   = require('dotenv').config();
const { Pool }      = require('pg')


// Create Instance of server and DB Connection
const server  = express();
const pool    = new Pool()


// Declare middleware server will use
// NEEDS to be DEFINED BEFORE ROUTES ARE SET
server.use(bodyParser.json({limit: '50mb'}));
server.use(cookieParser())


// Application Route Includes
const todos = require('./api/todos');


//Declare API Endpoint routes
server.use('/api/todos', todos);





server.get('/', function(req,res){
    res.send('Code Starter')
});


server.listen(process.env.PORT || 3000, () => {
  console.log(process.env.PORT);
  console.log(process.env.NODE_ENV);
});