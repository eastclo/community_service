const mongoose = require('mongoose');

const { Schema } = mongoose;
const {Types: ObjectId} = Schema;
const msgSchema = new Schema({
    sender_id: {
        type: ObjectId,
        ref: 'User',
    },
    receiver_id: {
        type: ObjectId,
        ref: 'User',
    },
    message:{
        type: String, 
        require: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Msg', msgSchema);