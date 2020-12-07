const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../schemas');
const { compareSync } = require('bcrypt');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => { //로그인 상태
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => { //로그아웃 상태
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('layout', {
    title: 'Community Service',
    twits,
  });
});
/*
router.get('/gallery', async (req, res, next) => {
  try {
    const posts = await Post.find().sort({'_id': id});
    console.log(posts);
    res.render('gallery', {
      title: 'Community Service',
      tiwts: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
*/
module.exports = router;