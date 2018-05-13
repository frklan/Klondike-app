var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//var compression = require('compression')

//  Dynamic routes
// var indexRouter = require('./routes/index');
// var aboutRouter = require('./routes/about');
// var helpRouter = require('./routes/help');
var apiV1 = require('./routes/api/v1/api.js')

const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

var server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

//server.use(compression())
//server.use(favicon(path.join(__dirname, '../../build', 'favicon.ico')));
server.use(logger(':date[iso] - :remote-addr :method :url :status :response-time ms - :res[content-length]'));
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: false }));
// server.use(cookieParser());

// Set API Gateway Middleware
//server.use(awsServerlessExpressMiddleware.eventContext())


if (process.env.NODE_ENV !== 'production') {
  server.use(express.static(path.join(__dirname, '../../build')));
}

//server.use('/', indexRouter);
//server.use('/about.html', aboutRouter);
//server.use('/help.html', helpRouter);
server.use('/api/v1', apiV1)


// catch 404 and forward to error handler
server.use(function(req, res, next) {
  var err = new Error('Not Found' + req);
  err.status = 404;
  next(err);
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = server;
