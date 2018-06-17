const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema/structure
const UserSchema = new Schema({//here these prop validation r done in two place->mongoose & Joi
    email: {
        type: String,
        required : true,
        unique : true,
        lowercase : true //bcoz for mongoose tsabunkar@gmail.com != TSABNKAR@GMAIL.COM
    },
    password: {
        type: String,
        required : true
    }
});

//create a model
const User = mongoose.model('user_auth_collec', UserSchema)

//export the model
module.exports = {
    User
}