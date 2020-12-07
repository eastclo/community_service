const express = require('express');

const Board = require('../schemas/board');
const User = require('../schemas/user');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn ,async (req, res, next) => {
    try {
        const posts = await Board.find({}).sort({ date: -1 });
        res.render('board', {
            titie: 'Community Service',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const poster = await User.find({"_id": req.user.id});
        await Board.create({
            poster_id: req.user.id,
            poster_nick: poster[0].nick,
            date: Date.now(),
            title: req.body.title,
            content: req.body.content,
        });
        res.redirect('/board');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/delete', async (req, res, next) => {
    try{
        await Board.deleteOne({"_id":req.body.id});
        res.redirect('/board');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
    //    const hashtags = req.body.content.match(/#[^\s#]+/g);
        await Board.updateOne({"_id": req.body.id},{$set:{
            date: Date.now(),
            title: req.body.title,
            content: req.body.content,
//            hashtag: req.body.hashtag,
        }});
        res.redirect('/board');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.post('/modify', async (req, res, next) => {
    try{
        const post = await Board.find({"_id":req.body.id});
        console.log(post[0]);
        res.render('board_modify', {
            twit: post[0],
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;