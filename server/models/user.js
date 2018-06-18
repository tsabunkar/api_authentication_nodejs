const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

//create a schema/structure
const UserSchema = new Schema({ //here these prop validation r done in two place->mongoose & Joi
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true //bcoz for mongoose tsabunkar@gmail.com != TSABNKAR@GMAIL.COM
    },
    password: {
        type: String,
        required: true
    }
});

//this piece of code will run before save() method, (i.e-saving the document to the DB)
UserSchema.pre('save', async function (next) {
    //not using fat arrow, bcoz using this keyword
    try {
        //Generate a salt
        const saltedVal = await bcrypt.genSalt(10) //10 is the number of rounds
        //generate a password hashed (salt + hash)
        const hashedPassword = await bcrypt.hash(this.password, saltedVal)
        //Re-assigning hashed version over original plain text password
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err)
    }
})

UserSchema.methods.isValidPassword = async function(passwordEntered){
    try{
        hashedPasswordFromDb = this.password;//bcoz password saved in the DB are in hashed format
       let PromiseObj = await  bcrypt.compare(passwordEntered, hashedPasswordFromDb)
        return PromiseObj;//promiseObj<boolean> is boolean type (i.e- true if passwordEntere == hashedPasswordFromDb )
    }catch(err){
        throw new Error(err);
    }

}


//create a model
const User = mongoose.model('user_auth_collec', UserSchema)

//export the model
module.exports = {
    User
}