const express = require('express');
// const router = express.Router; //instead we can use express-promise-router
const router = require('express-promise-router')(); //calling the function
const passport = require('passport');

const passportConfigu = require('../passportConfigu')
const UserController = require('../controller/usersController');
const {
    validationBody,
    loginSchema
} = require('../helpers/routehelper')



//http://localhost:3000/myusers/signup
router.route('/signup')
    .post(validationBody(loginSchema.authSchema), UserController.signUp);


//http://localhost:3000/myusers/signin
router.route('/signin')
    .post(validationBody(loginSchema.authSchema), passport.authenticate('local', {
        session: false
    }), UserController.signIn);


//authenticate()-> 1st argum is which startegy used to authenticat and 2nd argum is about the session as true/false 
//if the user tries to enter without signing-in then make that session as false
//http://localhost:3000/myusers/secret
router.route('/secret')
    .get(passport.authenticate('jwt', {
        session: false
    }), UserController.secretData);



//http://localhost:3000/myusers/oauth/google?access_token=<GOOGLE_TOKEN>
//http://localhost:3000/myusers/oauth/google?access_token=ya29.GlvfBabdvPn5-bHjcOymxzWox1_2TnEgEA94NBn5QGof9UdNzf4zMyN5GuslvieNqZQ-fDOwK_Ug1meUdEQFsyFz-jTzOBrgIzHG_PgrTlBFhZsVjPUH913eLKQy
/* router.route('/oauth/google')
    .get( passport.authenticate('google-plus-token', {session: false}) ); */
router.route('/oauth/google')
    .post(passport.authenticate('google-plus-token', { //google-plus-token , is default keyword way to call googleStrategy
        session: false
    }), UserController.googleOAuth_SignIn);


// http://localhost:3000/myusers/oauth/facebook/token?access_token=<FACEBOOK_TOKEN>   
// http://localhost:3000/myusers/oauth/facebook/token?access_token=EAAdYldokq30BAISmvRA6o477s79YA9AOYpsWbOh11LyXp1zYbmFFaXo6YxNOMjRhS7GfvirjkZBsJpaXVUXOPxVlVdZCbJUSXbNPpWZAkzGetT0CHzZBs3LIgIEdiPuXAyqIzJRE8RAK9wUPZC1HJXCEnFbqeuH4eiCJxIGMrzH2COy5eJA69ZBXAtRqTZCG7IZD
    router.route('/oauth/facebook/token')
    .post(passport.authenticate('facebook-token', { //facebook-token , is default keyword way to call googleStrategy
        session: false
    }), UserController.facebookOAuth_SignIn);



module.exports = {
    MyRouter: router
}