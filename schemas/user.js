const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    email: {
        type: String,
        required: false,
        unique: true,
    },
    nick: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    provider: {
        type: String,
        required: true,
        default: 'local',
    },
    snsId: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('User', userSchema);