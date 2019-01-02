const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// Setup Database Connection:
mongoose.connect(process.env.MONGODB_URI)
const cz_db = mongoose.connection
cz_db.on('error',console.error.bind(console, 'connection error:'))

cz_db.once('open', function() {

  // routing occurs here: 
  app.use('/', indexRouter); // ADMIN ACCESS ROUTING
  // app.use('/admin-login', indexRouter);
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

  

});

module.exports = app; 



