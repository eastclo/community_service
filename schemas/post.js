const mongoose = require('mongoose');

const { Schema } = mongoose;
const postSchema = new Schema({
    posters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
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