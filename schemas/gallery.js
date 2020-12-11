const mongoose = require('mongoose');

const { Schema } = mongoose;
const gallerySchema = new Schema({
    poster_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    poster_nick: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        require: true,
    },
    content: {
        type: String,
        require: false,
    },
    hashtags: [{
        type: String,
        require: false,
    }]
});

module.exports = mongoose.model('Gallery', gallerySchema);