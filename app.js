var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var paypal = require('paypal-rest-sdk');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* Para la subida de archivos al servidor */
/* https://www.npmjs.com/package/express-fileupload */
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// // PayPal Configuration
// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'AaSrItp0ysNRZ6VlT1qmvSJIcNEbknkGwD-KId5Xsi2Xbp4fbvrkFlteWSDY9e7ZFYvSK4IkqPbqrrhn',
//   'client_secret': 'EHFWePkM3b-a8Lh27kqj780aMn8uEFwHQH3joAArPkrQmgQs27Ni6tpc4SrG2Bag9XpoaWvRpYkOnwzg'
// });

module.exports = app;
