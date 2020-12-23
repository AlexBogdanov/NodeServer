const userRouter = require('./user-router');

module.exports = (app, controllers) => {
    app
        .use('/user', userRouter(controllers));
}