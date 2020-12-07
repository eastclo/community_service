const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = require('../schemas/post');
const Hashtag = require('../schemas/hashtag');
const User = require('../schemas/user');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

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
            cb(null, 'uploads/');
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
        console.log(req.body);
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if(hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    const check = Hashtag.find({ title: tag.slice(1).toLowerCase()});
                    if(check.length === 0) {
                        return Hashtag.create({
                            title: tag.slice(1).toLowerCase(),
                        });
                    }
                    return check[0];
                }),
            );
            await post.addHashtags(result.map(r => r[0])); //TODO
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    const twits = [];
    res.render('gallery', {
        title: 'Community Service',
        twits: twits,
    });
    /*
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [[ 'createdAt', 'DESC']],
        });
        res.render('gallery', {
            title: 'Community Service',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    */
});

module.exports = router;