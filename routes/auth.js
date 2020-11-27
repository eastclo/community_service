const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schemas/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => { //회원가입
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.find().where('email').equals(email); 
        if(exUser.length) { //기존에 가입한 사용자 에러처리
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); //비밀번호 암호화
        await User.create({ //사용자 정보 생성
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => { //passport.serializeUser호출
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); //미들웨어 내의 미들웨어
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy(); //세션정보 삭제
    res.redirect('/');
});

module.exports = router;