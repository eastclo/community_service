const passport = require('passport');
const local = require('./localStrategy');
const User = require('../schemas/user');
const mongoose = require('mongoose');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.find({ '_id': mongoose.Types.ObjectId(id) } )
            .then(user => done(null, user[0]))
            .catch(err => done(err));
    });

    local();
};