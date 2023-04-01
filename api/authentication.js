//Declare Module Includes
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const passport = require('passport');
const api_result = require('./modules/api_result');
const util = require('./modules/util');
const { Pool } = require('pg');
const pool = new Pool();


// Get User
router.get('/getUser', function(req, res, next) {

    // return user object
    if (req.isAuthenticated()){
        //const userObj = {}
        //userObj.userID = req.user.userID;
        //userObj.type = req.user.type;
        //const user = req.user.userID;
        res.send(api_result(true, req.user, 'Logged In'));
    } else {
        res.send(api_result(false, null, 'Not Logged In'));
    }

});


// Logout User
router.post('/logout', util.isAuthenticated, function(req, res, next) {

    //Kill Server Session
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('connect.sid');
        res.sendStatus(200);
        //res.redirect('/');
    });

    //Remove Client Session Cookie on Response
    //res.clearCookie('connect.sid');

    //Redirect to Logon Page
    //res.send(api_result(true, null, 'User Successfully Logged Out'));
    //res.sendStatus(200);

})


// Authenticate User
router.post('/authenticateUser', async function(req, res, next) {

    try {

        // Get Datbase Connection
        //const pool = await poolPromise
        //const request =  new sql.Request(pool);  

        //Read values from req BODY
        //const email     = req.body.email;
        //const password  = req.body.password;
        
        // add request values to sql input parameter         
        //request.input('email',sql.NVarChar,email)
            
        // Validate Email does not already have an account                
        //const result_validateLogin = await request.query("SELECT hash, salt, package, type  FROM dbo.users WHERE email = @email");

        // If account does not exist return with proper error message
        // if(result_validateLogin.recordset.length < 1) {
        //     res.send(api_result(false, null, 'No account found for the supplied email address.'));
        //     return false;
        // }
        
        // Account exists --> build hash to validate supplied password
        // var response = result_validateLogin.recordset[0];    
        // var userHash = response.hash;
        // var userSalt = response.salt;
        // var newHash = crypto.createHmac('sha256', util.passwordSecret)
        //     .update(userSalt + email + password)
        //     .digest('hex');

        //Hardcode match to force logon
        var userHash = 1;
        var newHash = 1;
        var email = 'test@test.com'
        var response = {}
        response.package = 'Base';
        response.type = 'User'

        // Validate Hash and log user on
        if (userHash === newHash) {
            // Create Request Session with the user email
            var userObj = {};
            userObj.userID = email;
            userObj.acctType = response.package;
            userObj.type = response.type;
            req.login(userObj, function(err) { 
                const user = req.user;
                res.send(api_result(true, user, 'User Successfully Authenticated'));
            });            
        } else {
            res.send(api_result(false, null, 'Invalid Password Supplied'));    
        }


    //Catch Errors    
    } catch (ex) {
        res.send(api_result(false, null, ex.toString()));
    }
});


// Required functions you need to implement for passport
passport.serializeUser(function(userObj, done) {
    //Way 1  - Store Full Object with values at time of log in in session
    done(null, userObj);
});

passport.deserializeUser(async function(user, done) { 
    //Way 1  -  Since Full object is in Session just relay it back
    done(null, user);
});


module.exports = router;