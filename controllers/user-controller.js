const { userData } = require('./../data');
const cloneOnly = require('./../utilities/clone-only');

const userController = {
    register: (req, res) => {
        const user = cloneOnly(req.body, ['username', 'password', 'email']);

        userData.register(user.username, user.password, user.email)
            .then(res.success)
            .catch(res.fail);
    },

    login: (req, res) => {
        const user = cloneOnly(req.body, ['username', 'password']);

        userData.login(user.username, user.password)
            .then(res.success)
            .catch(res.fail);
    }
};

module.exports = userController;
