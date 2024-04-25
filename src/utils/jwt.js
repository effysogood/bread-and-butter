const jwt = require('jsonwebtoken');
const secret = 'butter';

exports.secret = secret;

exports.setUserToken = (res, user) => {
    const token = jwt.sign(user, secret);
    res.cookie('token', token);
};