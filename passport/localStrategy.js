const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../schemas/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        }, async (email, password, done) => {
            try {
                const exUser = await User.find({'email':email}); //mysql에서의 findOne({where: {email}})
                if(exUser.length) {
                    const result = await bcrypt.compare(password, exUser[0].password);
                    if(result) {
                        done(null, exUser[0]);
                    } else {
                        done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    }
                } else {
                    done(null, false, { message: '가입되지 않은 회원입니다.' });
                }
            } catch (error) {
                console.error(error);
                done(error);
            }
        }));
};