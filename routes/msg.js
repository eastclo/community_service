const express = require('express');
const mongoose = require('mongoose');

const Msg = require('../schemas/msg');
const User = require('../schemas/user');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    try {
        const msgs = await Msg.find({ 'receiver_id': mongoose.Types.ObjectId(req.params.id)}).sort({createdAt:-1});
        for(let i = 0; i < msgs.length; i++) {
            const sender = await User.findOne({'_id': mongoose.Types.ObjectId(msgs[i].sender_id)});
            msgs[i].sender_nick = sender.nick;
            msgs[i].sender_email = sender.email;
        }
        res.render('msg', {
            messages: msgs,
            user: req.user,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id', async (req, res, next) => {
    try{
        const { receiver_email, message, user_id } = req.body;
        const user = await User.findOne({'email': receiver_email});
        if(!user) {
            return res.redirect('/msg?error=receiver_id_not_exist');
        }
        await Msg.create({
            sender_id: mongoose.Types.ObjectId(req.params.id),
            receiver_id: user._id,
            message: message,
        });
        res.redirect('/msg/'+user_id);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;