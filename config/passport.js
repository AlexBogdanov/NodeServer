const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const {
    secret
} = require('./config');
const User = require('./../models/User');

const BCRYPT_SALT_ROUNDS = 12;

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: secret
};

passport.use('local', new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: false
    },
    (username, password, done) => {
        try {
            User.findOne({
                    username
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'Invalid username'
                        });
                    } else {
                        bcrypt.compare(password, user.password)
                            .then(response => {
                                if (!response) {
                                    const msg = 'Invalid password';
                                    console.log(msg);
                                    return done(null, false, {
                                        message: msg
                                    });
                                }

                                console.log('User found and authenticated');
                                return done(null, user);
                            });
                    }
                });
        } catch (err) {
            done(err);
        }
    }
));

passport.use('jwt', new JWTstrategy(opts, (jwt_payload, done) => {
    try {
        User.findOne({
                username: jwt_payload.username
            })
            .then(user => {
                if (user) {
                    console.log('User found in DB in passport');
                    done(null, user);
                } else {
                    console.log('User not found in DB');
                    done(null, false);
                }
            });
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