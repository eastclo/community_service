const mongoose = require('mongoose');

const { Schema } = mongoose;
const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Post', postSchema);