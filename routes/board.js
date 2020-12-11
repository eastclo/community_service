const express = require('express');

const Board = require('../schemas/board');
const User = require('../schemas/user');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        let hash = req.query.hashtag;
        let content = req.query.content;
        let nick = req.query.nick;
        let posts;
        if (hash) {
            hash = hash.toLowerCase();
            posts = await Board.find({ 'hashtags': { $in: [hash] } }).sort({ date: -1 });
        } else if (content) //regex 구문 출처: https://cnpnote.tistory.com/entry/MONGODB-%ED%95%84%EB%93%9C%EA%B0%80-%EB%AC%B8%EC%9E%90%EC%97%B4%EC%9D%84-%ED%8F%AC%ED%95%A8%ED%95%98%EB%8A%94-%EA%B2%BD%EC%9A%B0-%ED%99%95%EC%9D%B8
            posts = await Board.find({ 'content': { $regex: content } }).sort({ date: -1 });
        else if (nick)
            posts = await Board.find({ 'poster_nick': {$regex: nick} }).sort({ date: -1 });
        else
            posts = await Board.find({}).sort({ date: -1 });
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
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if (hashtags) {
            for (let i = 0; i < hashtags.length; i++)
                hashtags[i] = hashtags[i].slice(1).toLowerCase(); //#제거 후 소문자로 저장
        }
        const poster = await User.find({ "_id": req.user.id });
        await Board.create({
            poster_id: req.user.id,
            poster_nick: poster[0].nick,
            date: Date.now(),
            title: req.body.title,
            content: req.body.content,
            hashtags: hashtags,
        });
        res.redirect('/board');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/delete', async (req, res, next) => {
    try {
        await Board.deleteOne({ "_id": req.body.id });
        res.redirect('/board');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if(hashtags) {
            for (let i = 0; i < hashtags.length; i++)
                hashtags[i] = hashtags[i].slice(1).toLowerCase(); //#제거 후 소문자로 저장
        }
        await Board.updateOne({ "_id": req.body.id }, {
            $set: {
                date: Date.now(),
                title: req.body.title,
                content: req.body.content,
                hashtags: hashtags,
            }
        });
        res.redirect('/board');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.post('/modify', async (req, res, next) => {
    try {
        const post = await Board.find({ "_id": req.body.id });
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