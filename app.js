// express and associated app dependencies 
const createError = require('http-errors');


const morgan = require('morgan')

const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session')

// database dependencies
const mongoose = require('mongoose')

// security dependencies
const helmet = require('helmet')
// const force_https = require('express-force-https')

// auth dependencies
const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const MongoStore = require('connect-mongo')(session);

require('dotenv').config()

const app = express();

/** Logger */
app.use(morgan('combined'))

/** Mongoose Connection Setup */

// init connection, config and error handling
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error',console.error.bind(console, 'connection error:'))


// Component Scripts:
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

/** Security and Protection */
app.use(helmet())
// app.use(force_https)

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
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 30 // 30 minutes cookie
  }
}))

// use passport and passport session:
app.use(passport.initialize())
app.use(passport.session())

// implement passport-local strategy: (admins)
const Admins = require('./models/adminuser')

passport.serializeUser(function (user, done) { 
  // console.log('serializing user: ', user)
  done(null, user.username)
})

passport.deserializeUser(function (username, done) { 

  // console.log('being to deserialize user: ', username)

  Admins.find({ username: username }, function (err, retDoc) { 

    if (err) { 
      console.log('Deserialization database access error', err)
      
    } else {

      // console.log('deserialization complete user: ', retDoc[0])
      done(null, retDoc[0]) 

    }

  })
})

passport.use('admin', new LocalStrategy( {
    usernameField: 'adminname',
    passwordField: 'password'
  },function (adminname, password, done) {
    Admins.find({username: adminname}, function(err, userDocArr) {

      // console.log('Doc with adminname: ',userDoc)
      let userDoc = userDocArr[0]

      // password stored in the database are bcrypted
      if (err) return done(err)
      
      // if authentication fails:
      if (!userDoc) return done(null,false, {error: true, message:'Username not found!'})

      if ( !bcrypt.compareSync(password, userDoc.password)) return done(null, false, {message:'Password Incorrect!'})
      
      // if authentication is successful:
      return done(null,userDoc)

    })

  })
)


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
