const jwt = require('jsonwebtoken');
const customError = require('./customError');

module.exports = (req, res, next) => {   
    try {
        const userToken = req.cookies.token;
        const decodedUser = jwt.verify(userToken, process.env.SECRET_KEY);
        req.user = decodedUser;
        
        next();

    } catch (err) {
        err = new customError(401, '로그인이 필요합니다.');
        next(err);
    }
}
