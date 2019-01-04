const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Gym = require('../models/gym')
const GymRoutes = require('../models/gymroutes')

const rtArrGen = require('../helpers/gen-route-obj-arr')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ADMIN ACCESS' });
});

/* GET admin login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN' });
});


/** RENDERING  VIEWS */

// POST - ADMIN dashboard: List all Gyms in Database:
router.post('/admin', function(req, res, next) {

  // Look for gyms listed in gym model: 
  Gym.find({},function(err,retDocs){

    if (err) console.error(err)
    else {

      console.log("GYM - RETURNED OBJ: ",retDocs)
      // render retrieved list of gyms
      res.render('admin-gyms', { gyms: retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})) });
    }

  })

});

// POST - GYM dashboard: List all routes in Gym
router.post('/admin/gym', function(req,res){
  // console.log('POST - routes for: ',req.body)

  let ThisGymModel = GymRoutes(req.body.model_name);

  ThisGymModel.find({}, function(err,retDocs){

    if (err) {
      console.error(err);
      res.json({message: 'see console for error details'})
    } else {

      // console.log('Routes for '+ req.body.gym_name +'----- ',retDocs);
      let gym_name = req.body.gym_name;
      let gym_collection_name = req.body.model_name;
      let route_info_arr = retDocs.map(doc => ({route_name: doc.route_name, setter_grade: doc.setter_input.setter_grade, current_grade_avg: doc.current_grade_average, current_star_rating: doc.current_star_rating}))
      console.log('Route Info to pass to GYM dash: ', route_info_arr)

      // console.log('Routes in ' + req.body.gym_name + ': ', retDocs)
      res.render('admin-gym-routes', { gym: route_info_arr, gym_name: gym_name, model_name: gym_collection_name});
    }

  })
  
})

router.post('/admin/dev-access', function(req,res){

  Gym.find({},function(err,retDocs){

    if (err) console.error(err)
    else {
      // console.info("All Gym Documents - ", retDocs, retDocs.map(doc => doc.gym_name), retDocs.map(doc => doc.model_name) );
      console.info("All Gym Documents - ", retDocs, retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})))
      
      // render list of gyms
      res.render('dev-dashboard', { gyms: retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})) });
    }

  })

})


/* Create new collections and documents */

// NEW GYM: view render
router.get('/admin-create/gym', function(req,res){
  // TODO: Add new model for each new gym created 

  res.render('admin-create-gym', { });
  // res.json({under_construction: 'page to create new gym '})
})

// CREATE NEW GYM: edit database
router.post('/admin-create/gym/new-gym', function(req,res){
  
  // console.log("NEW GYM - POST: ",req.body);
  // console.log("NEW GYM NAME: ", req.body.new_gym_name)
  // console.log("NEW GYM NAME (filtered): ", req.body.new_gym_name.toLowerCase().split('').filter(strChar => strChar != ' ').join(''))
  let new_gym_name = req.body.new_gym_name;
  let new_gym_num_routes = req.body.new_gym_num_routes;

  // Create MLAB friendly name for newly created gym's routes' mongoose model (i.e. mlab mongdb collection)
  let cleanedUpGymName = req.body.new_gym_name.toLowerCase().split('').filter(strChar => strChar != ' ').join('') + 'route';
  
  /* NEW GYM COMPONENTS:  
   * (1) entry in gyms collection  
   * (2a) a new dedicated collection, 
   * (2b) with specified number fo routes initilaized for that gym
   */

  // (1) create a new gym document, 
  Gym.create({gym_name: new_gym_name, model_name: cleanedUpGymName, route_count: new_gym_num_routes }, function(err,retDoc){
    
    if (err) {

      console.error('NEW GYM ERROR - ', typeof(err.code), err.code)
      // res.json({message: err.code})
      res.status(400).send({message: 'Duplicate'})

    } else {

      // console.log('RET DOC - ',retDoc)

      console.log("Initializing new collection for ",cleanedUpGymName)

      // (2a) initialize a new model/collection for newly added gym:
      let NewGymRoutes = GymRoutes(cleanedUpGymName);

      // (2b) initialize specified number of blank routes 
      if (new_gym_num_routes > 0) {

        console.log('Need to initialize '+new_gym_num_routes+' routes in new Gym: ' + new_gym_name)
        
        initRtArr = rtArrGen(new_gym_num_routes,new_gym_name)

        // console.log("Insert ", initRtArr, " to collection "+ cleanedUpGymName )

        if (initRtArr != []) {

          NewGymRoutes.insertMany(initRtArr, function(err,retObj){

            if (err) {
              console.error("Route Write Error: ", err);
              res.status(400).json({error: true, message: 'Init-ing routes in new Gym failed - delete Gym and retry.'})
            } else {
              
              // verify newly created collection exists and it's name matches the cleanedup version of the name:
              let currentCollections = Object.keys(mongoose.connection.collections);
              let newCollectionToExpect = cleanedUpGymName+'s';
              // console.log("Collections of this connection: ",currentCollections);
              // console.log('New collection to expect:', newCollectionToExpect);

              if (currentCollections.includes(newCollectionToExpect) !== -1) {
                res.json({message: 'Created "'+ new_gym_name +'" with '+ new_gym_num_routes +' climbing routes'})
              } else {
                res.json({message: 'Dedicated collection creation failed for "'+ new_gym_name +'"'})
              }

              
            }
          })

        } else {

          res.status(400).send({message: 'Routes Array not created!'})

        }

      } else {
        res.json({message: 'Created "'+ new_gym_name +'", no climbing routes initialized'})
      }

    }

  })

  
})

// NEW CLIMBING ROUTES IN GYM: view render
router.get('/admin-create/gym-route', function(req,res){
  // TODO: Add new route in gym collection for each new route created 

  // res.render('admin-create-gym-route', {  });
  res.json({under_construction: 'page to create new route in current gym'})
})

// NEW CLIMBING ROUTES IN GYM: edit database
router.post('/admin-create/gym-route', function(req,res){
  // console.log('NEW ROUTE - POST: ', req.body)

  let ThisGymModel = GymRoutes(req.body.model_name)

  res.json(req.body)
})

/* Delete gym route collections and corresponding entries in gym model */

// DELETE GYM: edit database
router.delete('/admin-delete/:gym', function(req,res){
  console.log('DELETE - gym: ', req.params)

  Gym.find({gym_name: req.params.gym}, function(err,retDoc){
    
    if (err) {
      console.error("Error finding gym document in gyms --", err)
      res.json({error: true, message: 'gym not found'});
    }
    else {
      // console.log(retDoc);
  
      let gym_collection_name = retDoc[0].model_name + 's';
      let gym_name = retDoc[0].gym_name;

      // console.log("parsed object names: ",gym_collection_name,gym_name)

      mongoose.connection.dropCollection(gym_collection_name, function(err,retObj){

        if (err) {
          console.error(gym_collection_name +' Collection delete error -- Error Code: ',err.code,'; Error Msg: ', err.errmsg)
        } else {
          console.log('Dropped collection - ', retObj)
        }

        Gym.deleteOne({gym_name: gym_name },function(err,retObjB){

          if (err) {
            console.error(gym_name + ' document delete error: ',err)
            res.json({error: true, message: gym_name + "not found in Gyms' collection" });
          } else {
            console.log("Deleted Gym entry",retObjB)
            res.json({message: 'uri response success'})
          }
        })
        

      })
      

    }

    
    
  })

  // setTimeout(function() {return res.json({message: 'uri response success'}) },2000,'timeout?')
  
})


module.exports = router;
