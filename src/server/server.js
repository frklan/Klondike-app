var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

var server = express();

server.use(logger(':date[iso] - :remote-addr :method :url :status :response-time ms - :res[content-length]'));
/**
 *  Always set Access Control Headers 
*/
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'application/json');
  next();
});

// Set API Gateway Middleware
//server.use(awsServerlessExpressMiddleware.eventContext())


if (process.env.NODE_ENV !== 'production') {
  // view engine setup
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'pug');

  server.use(express.static(path.join(__dirname, '../../build')));
}

//  Dynamic routes
var apiV1 = require('./routes/api/v1/api.js')
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
