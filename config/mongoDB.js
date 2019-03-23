const mongoose = require('mongoose');

const User = require('./../models/User');

mongoose.Promise = global.Promise;

const mongooseConfig = config => {
    mongoose.connect(config.dbPath, {
        useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.once('open', err => {
        if (err) {
            throw err;
        }

        User.seedAdminUser()
            .then(() => {
                console.log('Connected to MongoDB');
            }).catch(reason => {
                console.log('Error seeding admin', reason);
            });
    });
    db.on('error', reason => {
        console.log('Error connecting to MongoDB', reason);
    });
};

module.exports = config => mongooseConfig(config);
