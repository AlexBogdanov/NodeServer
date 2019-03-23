const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./../models/User');
const notifMsgs = require('./../constants/notification-messages');
const { secret } = require('./../config/config');

const BCRYPT_SALT_ROUNDS = 12;

const userData = {
    register: async (username, password, email ) => {
        try {
            const userDB = await User.findOne({ username });

            if (userDB) {
                throw new Error(notifMsgs.errors.USERNAME_TAKEN);
            }

            const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
            const hashedPass = await bcrypt.hash(password, salt);
            const user = {
                username,
                password: hashedPass,
                email,
                salt
            };
            const createdUser = await User.create(user);

            return { user: createdUser, msg: notifMsgs.success.SUCCESSFULL_REGISTER };
        } catch (err) {
            console.log(err);
            throw new Error(notifMsgs.errors.REGISTER_FAILED);
        }
    },

    login: async (username, password) => {
        try {
            const user = await User.findOne({ username });

            if (!user) {
                throw new Error(notifMsgs.errors.INVALID_USERNAME);
            }

            const hasedPass = await bcrypt.hash(password, user.salt);

            if (hasedPass !== user.password) {
                throw new Error(notifMsgs.errors.INVALID_PASSWORD);
            }

            const token = jwt.sign({ username: user.username }, secret);
            return { user, token, msg: notifMsgs.success.SUCCESSFULL_LOGIN };
        } catch (err) {
            console.log(err);
            throw new Error(notifMsgs.errors.LOGIN_FAILED);
        }
    }
};

module.exports = userData;
