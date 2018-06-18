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

router.route('/signup').post(validationBody(loginSchema.authSchema), UserController.signUp);

router.route('/signin')
    .post( validationBody(loginSchema.authSchema), passport.authenticate('local', {session: false}), UserController.signIn);

router.route('/secret')
    .get(passport.authenticate('jwt', {session: false}), UserController.secretData);
//authenticate()-> 1st argum is which startegy used to authenticat and 2nd argum is about the session as true/false 
//if the user tries to enter without signing-in then make that session as false
module.exports = {
    MyRouter: router
}