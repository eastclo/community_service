const mongoose = require('mongoose');

const { Schema } = mongoose;
const boardSchema = new Schema({
    poster_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    poster_nick: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    hashtags: [{
        type: String,
        required: false,
    }]
});

module.exports = mongoose.model('Board', boardSchema);