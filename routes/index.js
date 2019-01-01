var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


CONNECTION_STRING = 'mongodb://127.0.0.1:27017/climbzombie';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ADMIN ACCESS' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN' });
});

router.post('/admin', function(req, res, next) {
  // console.log(req.body, req.body.adminname, req.body.password);

  // TODO: Input validation

  // if input valid, connect to db and check credentials
  // MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err,db){

  //   if (err) {
  //     console.error(err);
  //     // TODO: load production page:
  //     // res.send('error connecting to db')
      
  //     // set locals, only providing error in development
  //     res.locals.message = err.message;
  //     res.locals.error = req.app.get('env') === 'development' ? err : {};
    
  //     // render the error page
  //     res.status(err.status || 500);
  //     res.render('error');
  //     db.close();
  //   } else {
  //     console.log('connected to db');

      // TODO: Authetication
      // if in-correct credentials, dont render gym admin page




      // if correct credentials, login and get array of gyms, send to pug page to render 

      // console.log(db.listCollections());
      
      // render list of gyms
      res.render('admin-gyms', { gymList: ['Gym A', 'Gym B', 'Gym C'] });

      // res.send('the gym selector page will load, (authentication implementation pending)');
    //   db.close();
    // }
  
    

  // })
  

});

router.get('/admin/:gym', function(req,res){

  res.render('admin-gym-routes', { gym: ['Route 1', 'Route 2', 'Route 3'] });

})

module.exports = router;
