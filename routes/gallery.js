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
        const hashtags = req.body.hashtags.match(/#[^\s#]+/g);
        if(hashtags) {
            for(let i = 0; i < hashtags.length; i++)
                hashtags[i] = hashtags[i].slice(1).toLowerCase(); //#제거 후 소문자로 저장
        }
        const poster = await User.find({"_id": req.user.id});
        await Gallery.create({
            poster_id: req.user.id,
            poster_nick: poster[0].nick,
            date: Date.now(),
            img: req.body.url,
            content: req.body.hashtags,
            hashtags: hashtags,
        });
        res.redirect('/gallery');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

const upload3 = multer();
router.post('/update', isLoggedIn, upload3.none(), async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if(hashtags) {
            for(let i = 0; i < hashtags.length; i++)
                hashtags[i] = hashtags[i].slice(1).toLowerCase(); //#제거 후 소문자로 저장
        }
        if(req.body.url) { //이미지 수정이 있을 경우
            await Gallery.updateOne({"_id": req.body.id},{$set:{
                img: req.body.url,
            }});
        }
        await Gallery.updateOne({"_id": req.body.id},{$set:{
            date: Date.now(),
            content: req.body.content,
            hashtags: hashtags,
        }});
        res.redirect('/gallery');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        let search = req.query.hashtag;
        let posts;
        if(search) {//해쉬태그 검색일시
            search = search.toLowerCase();
            posts = await Gallery.find({ 'hashtags' : { $in: [search]}}).sort({date: -1});
        }
        else 
            posts = await Gallery.find({}).sort({date: -1});
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

router.post('/modify', async (req, res, next) => {
    try{
        const post = await Gallery.findOne({"_id":req.body.id});
        res.render('gallery_modify', {
            twit: post
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;