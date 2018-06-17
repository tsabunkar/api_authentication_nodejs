require('./configuration/config') //import everything from config.js file

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {
    mongoose
} = require('./db/mongoose_config');


const app = express();
const port = process.env.PORT ;
const {
    MyRouter
} = require('./routes/usersRoute'); //object destructing 

//middleware
app.use(morgan('dev')); //there different options -> combined, common, dev, short, tiny
//Morgan is used for logging request details.(LOGGER for request and response)
app.use(bodyParser.json()); //We want JSON format for request and response


//routes
app.use('/myusers', MyRouter);


//starts the server
app.listen(port, () => {
    console.log(`server started @${port}`);
})