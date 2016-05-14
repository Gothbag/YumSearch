var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

var session = require('express-session');



//provide a sensible default for local development
mongodb_connection_string = 'mongodb://localhost:27017/yumsearchdb';
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + 'yumsearchdb';
}
mongoose.connect(mongodb_connection_string);

var app = express();

require('./config/passport')(passport); //passport is configured

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'resources', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.businessLogin = false;

app.use(session({secret: 'yums34rch1smys3cr3t', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index')(app, passport);
var users = require('./routes/users')(app, passport);
var businesses = require('./routes/business')(app, passport);
var offers = require('./routes/offers')(app);
var admin = require('./routes/admin')(app);
var ratings = require('./routes/ratings')(app);

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
