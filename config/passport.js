const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('./../models/User');
const notificationMessages = require('./../constants/notificationMessages');

const passportInit = (secret) => {
    const opts = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: secret
    };
    
    passport.use('local', new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false
        },
        async (username, password, done) => {
            try {
                const user = User.findOne({ username });
                if (!user) {
                    console.error(notificationMessages.errors.INVALID_USERNAME);
                    done(null, false, { message: notificationMessages.errors.INVALID_USERNAME });
                    return;
                }

                const response = bcrypt.compare(password, user.password);
                if (!response) {
                    console.error(notificationMessages.errors.INVALID_PASSWORD);
                    done(null, false, { message: notificationMessages.errors.INVALID_PASSWORD });
                    return;
                }

                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    ));
    
    passport.use('jwt', new JWTstrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findOne({ username: jwt_payload.username });
            if (user) {
                done(null, user);
                return;
            }
            
            done(null, false);
        } catch (err) {
            done(err);
        }
    }));
    
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    return passport;
};

module.exports = passportInit;
