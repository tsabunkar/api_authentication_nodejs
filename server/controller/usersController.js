const JWT = require('jsonwebtoken');

const {
    User
} = require('../models/user');

var signedToken = (userObj) => {
    const token = JWT.sign({
        iss: 'Sabunkar', //issurer name
        sub: userObj._id, //subject -> it will connect this token to ur actual document in the DB 
        iat: new Date().getTime(), //issued at -> time when this token was signed/encrypted
        exp: new Date().setDate(new Date().getDate() + 1), //expiration date of this token (expiring tomorrow)
        userObj
    }, process.env.JWT_SECRET) //encoding this new UserObj object -> to hashcode value

    return token;

}

var signUp = async (request, response, next) => {
    //email and password
    /* console.log('request.value.body is -', request.value.body);//instead of calling request.body, where first validating it and then calling request.value.body
    console.log('Signup fun is invoked'); */

    const email = request.value.body.email;
    const password = request.value.body.password;

    const foundUser = await User.findOne({ //wait here untill u finsh this task -> of finding the emai property from mongodb
        "local.email": email
    })
    if (foundUser) { //check if the user with same emaiId present in the DB
        response.status(409).json({
            error: 'Email already exist in the DB'
        })
        return
    }


    const newUserObj = new User({
        methodstosignup: 'local',
        local: {
            email,
            password
        }
    });

    await newUserObj.save(); // wait here, untill it the document is saved in the d.b

    console.log('data saved...');

    //respond with token value
    let signedTokenVal = signedToken(newUserObj);

    response.json({ //sending a response to user, saying the user object is created
        user: 'created',
        token: signedTokenVal
    })

}


var signIn = async (request, response, next) => {
    //it will go to passport.js
    //we need to generate token here

    console.log('signIn fun is invoked');
    //  console.log(request.user); 

    const tokenValue = signedToken(request.user)
    response.status(200).json({
        tokenValue
    })
}


var secretData = async (request, response, next) => {
    console.log('secretData fun is invoked');
    response.json({
        secret: 'private-resource-data'
    })
}

var googleOAuth_SignIn = async (request, response, next) => {
    console.log('googleOAuth_SignIn fun is invoked');
    const tokenValue = signedToken(request.user)
    response.status(200).json({
        tokenValue
    })
}


var facebookOAuth_SignIn= async  (request, response, next) => {
    console.log('facebookOAuth_SignIn fun is invoked');
    const tokenValue = signedToken(request.user)
    response.status(200).json({
        tokenValue
    })
}

module.exports = {
    signUp,
    signIn,
    secretData,
    googleOAuth_SignIn,
    facebookOAuth_SignIn
}