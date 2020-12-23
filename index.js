const express = require('express');
const Cors = require('cors');
const bodyParse = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const jsender = require('jsender');
const cookieParser = require('cookie-parser');
const nconf = require('nconf');

nconf.argv()
    .env()
    // Add configuration file in your root directory
    .file({ file: './config.json' });
require('./config/mongoDB')(nconf.get('dbPath'));

const app = express();
app.use(jsender());
app.use(Cors({
    origin: nconf.get('corsOrigins'),
    credentials: true
}));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cookieParser());
app.use(logger('dev'));

const passportSecret = nconf.get('passportSecret');
require('./config/passport')(passportSecret);
app.use(passport.initialize());

const controllers = require('./controllers')({ secret: passportSecret });
require('./routers/index')(app, controllers);

const port = nconf.get('port');
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
