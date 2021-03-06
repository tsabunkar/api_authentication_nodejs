const Joi = require('joi');

const validationBody = (loginSchema) => {
    return (request, response, next) => {
        const validateResult = Joi.validate(request.body, loginSchema); //validating the request body with the schema defined below
        if (validateResult.error) {
            response.status(400).json(validateResult.error)
            return
        }

        if (!request.value) { //if request.value is not there , then create a new object called request.value
            request.value = {};
        }

        request.value['body'] = validateResult.value; //  instead of writting the request.body, we will be writting request.value.body
        //NOTE : request.value['body'] is same as request.value.body
        next();


    }
}


//allows you to create blueprints or schemas for JavaScript objects
// (an object that stores information) to ensure validation of information.
const loginSchema = {
    authSchema: Joi.object().keys({
        /*   email: Joi.string().required().min(5).max(30),
          password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/), */
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}
module.exports = {
    validationBody,
    loginSchema
}