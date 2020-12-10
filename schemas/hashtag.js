const mongoose = require('mongoose');

const { Schema } = mongoose;
const hashtagSchema = new Schema({
    gallery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery',
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
    },
    content:{
        type: String, 
        require: true,
    },
});

module.exports = mongoose.model('Hashtag', hashtagSchema);