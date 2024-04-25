const express = require('express');
const router = express.Router();
const { User } = require('../db/models/userModel');
const hashPassword = require('../utils/hash-password');
const asyncHandler = require('../utils/async-handler');

router.get('/', async(req, res, next) => {
    res.send('users page.')
})

// 회원가입 
router.post('/register', asyncHandler(async(req, res, next) => {
    const { name, password, email, phone } = req.body;
    const user = await User.findOne({ email });
    if(user) {
        throw new Error('이미 가입된 회원입니다.');
    };
    const hashedPassword = hashPassword(password);
    await User.create({
        name,
        password: hashedPassword,
        email,
        phone,
        is_admin: false
    });
    res.status(201).json({
        status: 201,
        msg: '회원가입 완료'
    });
}));

router.post('/login', asyncHandler (async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) throw new Error('이메일이 일치하지 않습니다.');
    const correctPassword = user.password;
    if(correctPassword !== hashPassword(password)) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }

}))

router.delete('/:email', asyncHandler(async (req, res) => {
    const _email = req.params.email;
    await User.deleteOne({ email: _email });
}));

module.exports= router;