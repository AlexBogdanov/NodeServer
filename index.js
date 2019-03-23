const express = require('express');
const Cors = require('cors');
const bodyParse = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const jsender = require('jsender');

const config = require('./config/config');
require('./config/mongoDB')(config);

const app = express();
app.use(jsender());

require('./config/passport');

app.use(Cors());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(logger('dev'));
app.use(passport.initialize());

require('./routers/index')(app);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

module.exports = app;
