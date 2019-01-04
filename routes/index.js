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
      console.log()
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

      // console.log('Routes in ' + req.body.gym_name + ': ', retDocs)
      res.render('admin-gym-routes', { gym: [], gym_name: req.body.gym_name, model_name: req.body.model_name});
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

// NEW GYM: update database
router.post('/admin-create/gym/new-gym', function(req,res){
  
  // console.log("NEW GYM - POST: ",req.body);
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
  // console.log('NEW ROUTE - POST: ', req.body)

  let ThisGymModel = GymRoutes(req.body.model_name)

  res.json(req.body)
})

/* Delete gym route collections and corresponding entries in gym model */

// DELETE 
router.delete('/admin-delete/:gym', function(req,res){
  console.log('DELETE - gym: ', req.params)

  Gym.find({gym_name: req.params.gym}, function(err,retDoc){
    
    if (err) {
      console.error(err)
      res.json({error: true, message: 'gym not found'});
    }
    else {
      // console.log(retDoc);
  
      let gym_collection_name = retDoc[0].model_name + 's';
      let gym_name = retDoc[0].gym_name;

      console.log("parsed object names: ",gym_collection_name,gym_name)

      mongoose.connection.dropCollection(gym_collection_name, function(err,retObj){

        if (err) {

          console.error(gym_collection_name +' Collection delete error: ',err)
          res.json({error: true, message: gym_name + ' Collection not found in database.'});

        } else {

          console.log('Dropped collection - ', retObj)

          Gym.deleteOne({gym_name: gym_name },function(err,retObjB){

            if (err) {
              console.error(gym_name + ' document delete error: ',err)
              res.json({error: true, message: gym_name + "not found in Gyms' collection" });
            } else {
              console.log("Deleted Gym entry",retObjB)
              res.json({message: 'uri response success'})
            }
          })
        }

      })
      

    }

    
    
  })

  // setTimeout(function() {return res.json({message: 'uri response success'}) },2000,'timeout?')
  
})


module.exports = router;
