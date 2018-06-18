//Passport's sole purpose is to authenticate request, which it does through an extensible set of plugins known as strategies
// By default, it stores the user object in session.
const passport = require('passport'); //Passport is Express-compatible authentication middleware for Node.js.
const JwtStrategy = require('passport-jwt').Strategy; //A Passport strategy for authenticating with a JSON Web Token.
const LocalStrategy = require('passport-local').Strategy; //Passport strategy for authenticating with a username and password.

const {
    ExtractJwt
} = require('passport-jwt');

const {
    User
} = require('./models/user')

/* //sytnax
passport.use(new JwtStrategy({

}, async (payload, done) => {

})) */

//using JwtStrategy in passport
passport.use(new JwtStrategy({
    //authorizationkey -> must be in lower case
    jwtFromRequest: ExtractJwt.fromHeader('authorizationkey'), //extracting the token from request header (authroizationKey -> header key name)
    secretOrKey: process.env.JWT_SECRET //specifiying the secret value for jwt 
}, async (payload, done) => {
    try {
        console.log(payload.sub);
        //find a user specified in the token -> step (1)
        //then if user doesnt exist in the DB, handle it -> step (2)
        //otherwise, return the userObject -> step (3)

        //step 1)
        const userObj = await User.findById(payload.sub) //sub is from subject speicified in the JWT.sign({sub : __})
        //this payload is same as first argum in JWT.sign({}, '') [ie- payload object is same as object specified in the first argum in sign() method]

        //step 2)
        if (!userObj) { //user doesnot exist in the DB
            done(null, false) //done callback fun returning false
            return
        }

        //step 3)
        done(null, userObj); //done callback fun returning User-Object

    } catch (err) {
        done(err, false) //done callback fun returning false

    }
}))

//using LocalStrategy in passport

passport.use(new LocalStrategy({
    usernameField: "email" ,//by default localStartegy will authenticate username and password, but instead of username we want to authenticate email property, soo need to specifiy
    passwordField : "password"
}, async (username, password, done) => {
   
    console.log(username);
    console.log(password);
    //find the user with the passed emailId
    //if not handle it, (invalid emailId)
    //if user is found, then check if the password is correct
    //if not handle it, (invalid password)
    //thus success, valid credentials , pass the user object

    try {
        //find the user with the passed emailId
        const userObj = await User.findOne({
            username
        })
        //if not handle it, (invalid emailId)
        if (!userObj) {
            done(null, false)
            return
        }

        //if user is found, then check if the password is correct
        const isMatched = await userObj.isValidPassword(password);

        //if not handle it, (invalid password)
        if (!isMatched) { //password didn't match scenario
            done(null, false)
        }

        //thus success, valid credentials , pass the user object
        done(null, userObj);
    } catch (err) {
        done(err, false) //done callback fun returning false
    }

}))