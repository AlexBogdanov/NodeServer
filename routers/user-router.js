const router = require('express').Router();
const passport = require('passport');

const { userController } = require('./../controllers');

router
    .post('/register', userController.register)
    .post('/login', passport.authenticate('local'), userController.login);

module.exports = router;
