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


server.use(function(req, res, next){
  res.status(404);
  res.send({ error: 'resource not found' });
  next();
});

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}
module.exports = server;
