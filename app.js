// express and associated app dependencies 
const createError = require('http-errors');

// display server-side app activity 
const morgan = require('morgan')

const express = require('express')

const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash')

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
app.use(morgan('dev'))

app.use(flash())


/** Mongoose Connection Setup */

// init connection, config and error handling
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error',console.error.bind(console, 'connection error:'))

//  require models of collections 
const Admins = require('./models/adminuser')
const Gyms = require('./models/gym')

// Component Scripts:
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

/** Security and Protection */
app.use(helmet())
app.use(force_https)

/** Pug view engine setup */ 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/** Passport Setup */

// init session:
app.use(session({
  name: 'climbzombie',
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 30 // 30 minutes cookie
  }
}))

// use passport and passport session:
app.use(passport.initialize())
app.use(passport.session())



// serialize-deserialize 
passport.serializeUser(function (user, done) { 
  
  // console.log('serializing user: ', user)

  if (user.username) done(null, user.username)
  else if (user.gym_name) done(null, { gym: true, name: user.gym_name })
  
})

passport.deserializeUser(function (loginer, done) { 

  // console.log('begin to deserialize user: ', loginer, typeof(loginer))

  if (!loginer.gym && typeof (loginer) === 'string') {

    Admins.find({ username: loginer }, function (err, retDoc) {

      if (err) {
        console.log('admin deserialization database access error', err)
        
      } else {
        // console.log('admin deserialization complete for: ', retDoc[0])
        done(null, retDoc[0])

      }

    })

  } else if (loginer.gym && typeof (loginer) === 'object') { 

    Gyms.find({ gym_name: loginer.name }, function (err, retDoc) { 

      if (err) {
        console.log('gym-owner deserialization database access error', err)

      } else { 
        // console.log('gym-owner deserialization complete for', retDoc[0])
        done(null, retDoc[0])

      }

    })

  }

  
})

// implement passport-local strategy: (admins)
passport.use('admin',
  
  new LocalStrategy(

    {
      usernameField: 'adminname',
      passwordField: 'password'
    },
    
    function (adminname, password, done) {

      Admins.find({ username: adminname }, function (err, userDocArr) {

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

    }

  )
  
)


// implement passport-local strategy: (gym-owner)
passport.use('gym-owner',
  
  new LocalStrategy(

    {
      usernameField: 'gymname',
      passwordField: 'password'
    },
  
    function (gymname, password, done) {    
    
      Gyms.find({ gym_name: gymname }, function (err, gymDocsArr) {
    
        // console.log('LOCAL G-O STRATEGY: doc found with entered gymname -- ', gymDocsArr)
        let gymDoc = gymDocsArr[0]

        // password stored in the database are bcrypted
        if (err) return done(err)
        
        // if authentication fails:

        // bad userame
        if (!gymDoc) return done(null,false, {error: true, message:'Gym not found!'})

        //  bad password
        if ( !bcrypt.compareSync(password, gymDoc.password)) return done(null, false, {message:'Password Incorrect!'})
        
        // if authentication is successful:
        return done(null,gymDoc)

      })

    }

  )
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
