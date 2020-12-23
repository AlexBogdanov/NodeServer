const User = require('./../models/User');

const userData = {
    findByUsername: username => new Promise((resolve, reject) => {
        User.findOne({ username }, (err, fetchedUser) => {
            if (err) reject(err);
            resolve(fetchedUser);
        });
    }),

    createUser: user =>  new Promise((resolve, reject) => {
        User.create(user, (err, createdUser) => {
            if (err) reject(err);
            resolve(createdUser);
        })
    }),

    updateRefreshToken: (userId, newRefreshToken) => new Promise((resolve, reject) => {
        User.findByIdAndUpdate(
            userId,
            { refreshToken: newRefreshToken },
            err => {
                if (err) reject(err);
                resolve();
            }
        );
    }),

    findByRefreshToken: refreshToken => new Promise((resolve, reject) => {
        User.findOne({ refreshToken }, (err, fetchedUser) => {
            if (err) reject(err);
            resolve
            (fetchedUser);
        });
    })
};

module.exports = userData;
