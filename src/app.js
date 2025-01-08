const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const viewRouter = require('./routers/viewRouter');
const bookRouter = require('./routers/bookRouter');
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const orderRouter = require('./routers/orderRouter');
const uploadRouter = require('./routers/uploadRouter');
const loginRequired = require('./middlewares/loginRequired');
const adminOnly = require('./middlewares/adminOnly');
//connect to mongodb
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('📍 Connected to MongoDB');
});

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://bread-and-butter-silk.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', loginRequired, adminOnly);
app.use(viewRouter);

app.get('/', (req, res) => {
  res.send('Butter and Better');
});
app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/uploads', uploadRouter);
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    msg: err.message,
  });
});

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'views')));
app.use('/join', express.static(path.join(__dirname, 'views/join')));
app.use('/login', express.static(path.join(__dirname, 'views/login')));
app.use('/order', express.static(path.join(__dirname, 'views/order')));
app.use(
  '/ordertrack',
  express.static(path.join(__dirname, 'views/ordertrack'))
);
app.use('/mypage', express.static(path.join(__dirname, 'views/mypage')));
app.use('/common', express.static(path.join(__dirname, 'views/common')));
app.use('/images', express.static(path.join(__dirname, 'views/common/img')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API 라우트들
app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/uploads', uploadRouter);

// 모든 HTML 요청을 처리하는 라우트
app.get('*', (req, res) => {
  const reqPath = req.path === '/' ? '/home/home.html' : `${req.path}.html`;
  const filePath = path.join(__dirname, 'views', reqPath.replace(/^\//, ''));

  // 파일 존재 여부 확인 후 전송
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

module.exports = app;
