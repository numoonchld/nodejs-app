const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Gym = require('../models/gym')
const GymRoutes = require('../models/gymroutes')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ADMIN ACCESS' });
});

/* GET admin login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN' });
});

/* POST username and password, authenticate, then load dashboard */
router.post('/admin', function(req, res, next) {

  console.log(req.body, req.body.adminname, req.body.password);

  // TODO: Input validation
  // TODO: Authetication
  

  console.log('model names create in this instance of mongoose: ',mongoose.modelNames());
  Gym.find({},function(err,retDocs){

    if (err) console.error(err)
    else {
      // console.info("All Gym Documents - ", retDocs, retDocs.map(doc => doc.gym_name), retDocs.map(doc => doc.model_name) );
      console.info("All Gym Documents - ", retDocs, retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})))
      
      // render list of gyms
      res.render('admin-gyms', { gyms: retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})) });
    }

  })

});

router.post('/admin/gym', function(req,res){
  console.log('POST - routes for: ',req.body)

  let ThisGymModel = GymRoutes(req.body.model_name);
  ThisGymModel.find({}, function(err,retDocs){

    if (err) {
      console.error(err);
      res.json({message: 'see console for error detailsrs'})
    } else {

      console.log('Routes in ' + req.body.gym_name + ': ', retDocs)
      res.render('admin-gym-routes', { gym: [], gym_name: req.body.gym_name, model_name: req.body.model_name});
    }

  })
  
})

router.post('/admin/dev-access', function(req,res){

  // set db for proof-of-concept:

  // // TODO: create default admin login and password:
  // Admin.create({adminname: 'admin', password: 'password'})

  // // TODO: initialize three gyms:
  // Gym.insertMany([{gym_name: 'GYM A', model_name: 'gymaroute', route_count: 20},{gym_name: 'GYM B'},{gym_name: 'GYM C'}])

  // // TODO: initilize twenty routes in first gym: 
  // GymARoute.insertMany([{route_name: 'Route 1',gym_name: 'Gym A',climber_opinions:[]}])
  
  res.json({under_construction: 'reset database to default values'})

})


/* Create new collections and documents */

// NEW GYM: view render
router.get('/admin-create/gym', function(req,res){
  // TODO: Add new model for each new gym created 

  res.render('admin-create-gym', { });
  // res.json({under_construction: 'page to create new gym '})
})

// NEW GYM: update database
router.post('/admin-create/gym/new-gym', function(req,res){
  
  console.log("NEW GYM - POST: ",req.body);
  // res.json({message: 'POST loaded'})

  // console.log("NEW GYM NAME: ", req.body.new_gym_name)
  // console.log("NEW GYM NAME (filtered): ", req.body.new_gym_name.toLowerCase().split('').filter(strChar => strChar != ' ').join(''))

  // Create MLAB friendly name for newly created gym's routes' mongoose model (i.e. mlab mongdb collection)
  let cleanedUpGymName = req.body.new_gym_name.toLowerCase().split('').filter(strChar => strChar != ' ').join('') + 'route';
  
  // TODO: create a new gym document 
  Gym.create({gym_name: req.body.new_gym_name, model_name: cleanedUpGymName, route_count: req.body.new_gym_num_routes }, function(err,retDoc){
    
    if (err) {

      // console.error('NEW GYM ERROR - ', typeof(err.code), err.code)
      // res.json({message: err.code})
      res.status(400).send({message: 'Duplicate'})

    } else {

      // console.log('RET DOC - ',retDoc)

      // initialize a new model/collection for newly added gym:
      let NewGymRoutes = GymRoutes(cleanedUpGymName);

      // initialize specified number of blank routes 
      if (req.body.new_gym_num_routes !== 0) {
        
      }

      // res.json(req.body);
      res.json({message: 'Created '+ req.body.new_gym_name +' with '+ req.body.new_gym_num_routes +' climbing routes'})

    }
    
  })

  
})

// NEW CLIMBING ROUTES IN GYM: view render
router.get('/admin-create/gym-route', function(req,res){
  // TODO: Add new route in gym collection for each new route created 

  // res.render('admin-create-gym-route', {  });
  res.json({under_construction: 'page to create new route in current gym'})
})

// NEW CLIMBING ROUTES IN GYM: update database
router.post('/admin-create/gym-route', function(req,res){
  console.log('NEW ROUTE - POST: ', req.body)

  let ThisGymModel = GymRoutes(req.body.model_name)

  res.json(req.body)
})



module.exports = router;
