// express and associated app dependencies 
const createError = require('http-errors');

const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session')

// database dependencies
const mongoose = require('mongoose')

// security dependencies
const helmet = require('helmet')

// auth dependencies
const passport = require('passport')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local')

require('dotenv').config()

const app = express();

/** Mongoose Connection Setup */

// init connection, config and error handling
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error',console.error.bind(console, 'connection error:'))


// Component Scripts:
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/** Helmet Protection */
app.use(helmet());

/** Pug view engine setup */ 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/** Passport Setup */

// init session:
app.use(session({
  name: 'climbzombie',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store:
}))

// use passport and passport session:
app.use(passport.initialize())
app.use(passport.session())




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


module.exports = app; 



