//Declare Module Includes
const express         = require('express');
const expressSession  = require('express-session');
const pg              = require('pg');
const pgSession       = require('connect-pg-simple')(expressSession);
const passport        = require('passport');
const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const environment     = require('dotenv').config();


// Create Instance of server and DB Connection
const server  = express();

// Declare middleware server will use
// NEEDS to be DEFINED BEFORE ROUTES ARE SET
server.use(bodyParser.json({limit: '50mb'}));
server.use(cookieParser())


// Setup Auth with Sesssion Store and Passport
const pgPool = new pg.Pool
server.use(expressSession({
  store: new pgSession({pool: pgPool}),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

server.use(passport.initialize());
server.use(passport.session());

// Application Route Includes
const todos = require('./api/todos');
const auth = require('./api/authentication');


//Declare API Endpoint routes
server.use('/api/todos', todos);
server.use('/authentication', auth);





server.get('/', function(req,res){
    res.send('Code Starter')
});


server.listen(process.env.PORT || 3000, () => {
  console.log(process.env.PORT);
  console.log(process.env.NODE_ENV);
});