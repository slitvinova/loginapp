var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var mongo = require('mongodb');
var localStrategy = require('passport-local').Strategy;
var exphbs = require('express-handlebars');

// paroļu hešošana
var bcrypt = require('bcryptjs');
// flash messages
var flash = require('connect-flash');
// mongodb ORM
var mongoose = require('mongoose');

// savienojums ar datu bāzi
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;


var routes = require('./routes/index');
var users = require('./routes/users');

// inicializēt express lietotni
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// body-parser, cookie-parser pāreja (middleware)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// statiska mape stiliem, jquery u.t.t.
app.use(express.static(path.join(__dirname, 'public')));

// Express Session pāreja (middleware)
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'), 
      root    = namespace.shift(), 
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// pievienot Flash
app.use(flash());

// globālie mainīgie Flash paziņojumiem
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// passport inicializācija
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

module.exports = app;
