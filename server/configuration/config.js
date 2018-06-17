var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {

    var config = require('./config.json')
    if (env === 'development') {
        process.env.PORT = config.development.PORT;
        process.env.MONGODB_URI = config.development.MONGODB_URI;
        process.env.JWT_SECRET = config.development.JWT_SECRET;
    } else {
        process.env.PORT = config.test.PORT;
        process.env.MONGODB_URI = config.test.MONGODB_URI;
        process.env.JWT_SECRET = config.test.JWT_SECRET;
    }

}