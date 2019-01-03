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

router.post('/admin', function(req, res, next) {
  console.log(req.body, req.body.adminname, req.body.password);

  // TODO: Input validation
  // TODO: Authetication
  

  console.log('model names create in this instance of mongoose: ',mongoose.modelNames());

  res.render('admin-gyms', { gymList: [] });

  // render list of gyms
  
});

router.get('/admin/:gym', function(req,res){
  res.render('admin-gym-routes', { gym: ['Route 1', 'Route 2', 'Route 3'] });
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


// Create new collections and documents:
router.get('/admin-create/gym', function(req,res){
  // TODO: Add new model for each new gym created 

  res.render('admin-create-gym', { });
  // res.json({under_construction: 'page to create new gym '})
})

router.post('/admin-create/gym/new-gym', function(req,res){
  
  console.log("NEW GYM - POST: ",req.body);
  res.json({})

  // console.log("NEW GYM NAME: ", req.body.new_gym_name)
  // console.log("NEW GYM NAME (filtered): ", req.body.new_gym_name.toLowerCase().split('').filter(strChar => strChar != ' ').join(''))

  // let cleanedUpGymName = req.body.new_gym_name.toLowerCase().split('').filter(strChar => strChar != ' ').join('') + 'route';
  

  // // TODO: create a new gym document 
  // Gym.create({gym_name: req.body.new_gym_name, model_name: cleanedUpGymName, route_count: req.body.new_gym_num_routes }, function(err,retDoc){

  //   // TODO: create a new model/collection for newly added gym:
  //   let NewGymRoutes = GymRoutes(cleanedUpGymName);

  //   // res.json(req.body);

  // })

  
})


router.get('/admin-create/gym-route', function(req,res){
  // TODO: Add new route in gym collection for each new route created 

  // res.render('admin-create-gym-route', {  });
  res.json({under_construction: 'page to create new route in current gym'})
})

router.post('/admin-create/gym-route/new-route', function(req,res){
  res.send(req.body)
})



module.exports = router;
