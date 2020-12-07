const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Gallery = require('../schemas/gallery');
const User = require('../schemas/user');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/')
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
    //    const hashtags = req.body.content.match(/#[^\s#]+/g);
        const poster = await User.find({"_id": req.user.id});
        await Gallery.create({
            poster_id: req.user.id,
            poster_nick: poster[0].nick,
            date: Date.now(),
            img: req.body.url,
        });
        res.redirect('/gallery');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Gallery.find({}).sort({date: -1});
        res.render('gallery', {
            title: 'Community Service',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/delete', async (req, res, next) => {
    try{
        await Gallery.deleteOne({"_id":req.body.id});
        res.redirect('/gallery');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/modify', (req, res, next) => {
    try{
        res.redirect('/gallery_modify');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

const upload3 = multer();
router.post('/update', isLoggedIn, upload3.none(), async (req, res, next) => {
    try {
    //    const hashtags = req.body.content.match(/#[^\s#]+/g);
        await Gallery.updateOne({"_id": req.body.id},{$set:{
            date: Date.now(),
            img: req.body.url,
       //     hashtag: req.body.hashtag,
        }});
        res.redirect('/gallery');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/modify', async (req, res, next) => {
    try{
        const post = await Gallery.find({"_id":req.body.id});
        console.log(post[0]);
        res.render('gallery_modify', {
            twit: post[0]
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;