const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { BCRYPT_SALT_ROUNDS } = require('./../constants/commonConstants');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    refreshToken: { type: String }
});

const User = mongoose.model('User', UserSchema);

User.seedAdminUser = async () => {
    try {
        const users = await User.find();
        if (users.length > 0) return;

        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        const hashedPass = await bcrypt.hash('123123', salt);
        const admin = {
            username: 'admin',
            password: hashedPass,
            email: 'admin@admin.bg',
            salt
        };
        await User.create(admin);
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
