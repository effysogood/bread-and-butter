const customError = require('../middlewares/customError');
module.exports = (req, res, next) => {
    if (req.cookies && req.user.role === 'admin') {
        next();
    } else {
        throw new customError(403, "관리자만 접근 가능한 페이지입니다.");
    }
}
