const router = require('express').Router();
const passport = require('passport');

const userRouter = controllers => {
    const { userController } = controllers;

    router
        .post('/register', userController.register)
        .post('/login', userController.login)
        .get('/logout', passport.authenticate('jwt'), userController.logout)
        .get('/refresh-jwt', userController.refreshJWTToken);

    return router;
};

module.exports = userRouter;
