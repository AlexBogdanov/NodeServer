const BCRYPT_SALT_ROUNDS = 12;
const jwtConstants = {
    tokenExpirationStr: '15m',
    tokenExpirationInMinutes: 15,
    randtokenSize: 256
}

module.exports = {
    BCRYPT_SALT_ROUNDS,
    jwtConstants
};
