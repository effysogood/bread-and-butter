const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../db/models/userModel');
const hashPassword = require('../../utils/hash-password');

const config = {
    usernameField: 'email',
    passwordField: 'password',
};

const local = new LocalStrategy(config, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if(!user) throw new Error('이메일이 일치하지 않습니다.');
        const correctPassword = user.password;
        if(correctPassword !== hashPassword(password)) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        done (null, {
            email: user.email,
            name: user.name
        });
    } catch (err){
        done(err, null);
    }
});