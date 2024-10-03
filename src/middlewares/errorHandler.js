// 에러 처리 전담 미들웨어

const errorHandler = (error, req, res, next) => {
  if (!error.status) {
    res.status(500).send({
      status: 500,
      reason: error.message,
    });
  }
  res
    .status(error.status)
    .json({ status: error.status, reason: error.message });
};

module.exports = errorHandler;
