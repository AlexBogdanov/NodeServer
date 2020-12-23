const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const { userData } = require('./../data');
const { cloneOnly } = require('./../utilities/clone-only');
const notificationfMessages = require('./../constants/notificationMessages');
const { BCRYPT_SALT_ROUNDS, jwtConstants } = require('./../constants/commonConstants');

const registerProps = [
    'username',
    'password',
    'email'
];

const loginProps = [
    'username',
    'password'
];

const userController = ({ secret }) => {
    const register = async (req, res) => {
        try {
            const userDto = cloneOnly(req.body, registerProps);
            const userDB = await userData.findByUsername(userDto.username);

            if (userDB) {
                throw new Error(notificationfMessages.errors.USERNAME_TAKEN);
            }

            const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
            const hashedPass = await bcrypt.hash(userDto.password, salt);
            const user = {
                username: userDto.username,
                password: hashedPass,
                email: userDto.email,
                salt
            };
            await userData.createUser(user);

            res.success({ msg: notificationfMessages.success.SUCCESSFULL_REGISTER });
        } catch (err) {
            console.error(err);
            res.error(new Error(notificationfMessages.errors.REGISTER_FAILED));
        }
    };

    const login = async (req, res) => {
        try {
            const userDto = cloneOnly(req.body, loginProps);
            const user = await userData.findByUsername(userDto.username);

            if (!user) {
                throw new Error(notificationfMessages.errors.INVALID_USERNAME);
            }

            const hashedPass = await bcrypt.hash(userDto.password, user.salt);

            if (hashedPass !== user.password) {
                throw new Error(notificationfMessages.errors.INVALID_PASSWORD);
            }

            const tokenExpiration = new Date();
            tokenExpiration.setMinutes(tokenExpiration.getMinutes() + jwtConstants.tokenExpirationInMinutes);
            const token = jwt.sign(
                { username: user.username }  ,
                secret,
                { expiresIn: jwtConstants.tokenExpirationStr }
            );

            const refreshToken = randtoken.uid(jwtConstants.randtokenSize);
            await userData.updateRefreshToken(user._id.toString(), refreshToken);
            res.cookie('refreshToken', refreshToken, { httpOnly: true });

            const result = {
                token,
                tokenExpiration,
                msg: notificationfMessages.success.SUCCESSFULL_LOGIN
            };
            res.success(result);
        } catch (err) {
            console.error(err);
            res.error(new Error(notificationfMessages.errors.LOGIN_FAILED));
        }
    };

    const logout = (req, res) => {
        userData.updateRefreshToken(req.user._id.toString(), '')
            .then(res.success)
            .catch(err => {
                console.error(err);
                res.error(new Error(notificationfMessages.errors.LOGOUT_FAILED));
            });
    };

    const refreshJWTToken = async (req, res) => {
        try {
            const refreshToken = req.cookie.refreshToken || '';
            const user = await userData.findByRefreshToken(refreshToken);

            if (!user) {
                throw new Error(notificationfMessages.errors.CANNOT_REFRESH_JWT);
            }

            const tokenExpiration = new Date();
            tokenExpiration.setMinutes(tokenExpiration.getMinutes() + jwtConstants.tokenExpirationInMinutes);
            const token = jwt.sign(
                { username: user.username },
                secret,
                { expiresIn: jwtConstants.tokenExpirationStr }  
            );

            const newRefreshToken = randtoken.uid(jwtConstants.randtokenSize);
            await userData.updateRefreshToken(user._id.toString(), newRefreshToken);

            res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
            res.success({ token, tokenExpiration });
        } catch (err) {
            console.error(err);
            res.error(new Error(notificationfMessages.errors.CANNOT_REFRESH_JWT));
        }
    };

    return {
        register,
        login,
        logout,
        refreshJWTToken
    };
};

module.exports = userController;
