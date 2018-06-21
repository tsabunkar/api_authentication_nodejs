const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

//create a schema/structure
const UserSchema = new Schema({ //here these prop validation r done in two place->mongoose & Joi
    methodstosignup: { //it will tell us, what type of method used by end user to make his/her account ie- whether signedup using local authen, google authen or facebook authen
        type: String,
        enum: ['local', 'google', 'facebook'], //this methodstosignup can be either of this String value only
        required: true
    },
    local: { //if user signed up using local authentication
        email: {
            type: String,
            lowercase: true //bcoz for mongoose tsabunkar@gmail.com != TSABNKAR@GMAIL.COM
        },
        password: {
            type: String,
        }
    },
    google: { //if user signed up using google authentication
        googleId: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: { //if user signed up using facebook authentication
        facebookId: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }

});

//this piece of code will run before save() method, (i.e-saving the document to the DB)
UserSchema.pre('save', async function (next) {
    //not using fat arrow, bcoz using this keyword
    try {
        if (this.methodstosignup !== 'local') {
            //methods property is google or facebook then dont execute below code, return from here
            next();
        }


        //Generate a salt
        const saltedVal = await bcrypt.genSalt(10) //10 is the number of rounds
        //generate a password hashed (salt + hash)
        const hashedPassword = await bcrypt.hash(this.local.password, saltedVal)
        //Re-assigning hashed version over original plain text password
        this.local.password = hashedPassword;
        next();
    } catch (err) {
        next(err)
    }
})

UserSchema.methods.isValidPassword = async function (passwordEntered) {
    try {
        hashedPasswordFromDb = this.local.password; //bcoz password saved in the DB are in hashed format
        let PromiseObj = await bcrypt.compare(passwordEntered, hashedPasswordFromDb)
        return PromiseObj; //promiseObj<boolean> is boolean type (i.e- true if passwordEntere == hashedPasswordFromDb )
    } catch (err) {
        throw new Error(err);
    }

}


//create a model
const User = mongoose.model('user_auth_collec', UserSchema)

//export the model
module.exports = {
    User
}