const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const bookRouter = require('./routers/bookRouter');
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');

//require('./passport')();

//connect to mongodb
// TODO : env 연결 확인
// mongoose.connect(process.env.MONGO_URI);
mongoose.connect(
  'mongodb+srv://butterandbetter:Uqt93SbIF7GNPOXM@main.xqqect0.mongodb.net/BAB'
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('📍 Connected to MongoDB');
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Butter and Better');
});

//app.use(passport.initialize());

app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
