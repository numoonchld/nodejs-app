const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Gym = require('../models/gym')
const GymRoutes = require('../models/gymroutes')

const initRtArrGen = require('../helpers/gen-init-route-arr')
const addRtArrGen = require('../helpers/add-routes-to-gym')

const bcrypt = require('bcrypt')
const passport = require('passport')

/** 00. LANDING PAGE ------------------------------------------------ */
router.get('/', function(req, res, next) {
  res.render('land-climb-zombie', { });
});

/** 01. LOGIN UI ------------------------------------------------ */

// 01.a. login page
router.get('/login', function(req, res, next) {
  
  // look for existing gym accounts:
  Gym.find({},function(err,docsArr){

    if (err) {

      console.log('GO login page, db connect error -- ',err)

      res.render('login', { title: 'GYM OWNER LOGIN', further_access: true, gym_accounts_exist: false, error: true });

    } else {

      // console.log('----', docsArr)

      if (docsArr.length > 0) {

        //  gym owner login page:
        res.render('login', { title: 'GYM OWNER LOGIN', further_access: true, gym_accounts_exist: true, error: false });

      } else {

        //  gym owner login page:
        res.render('login', { title: 'GYM OWNER LOGIN', further_access: true, gym_accounts_exist: false, error: false });

      }

    }

  })

});

// 01.b. login page 
router.get('/login/admin', function(req, res, next) {
  // admin login page:
  res.render('login', { title: 'ADMIN LOGIN', further_access: false });
});

/** 02. LANDING DASHBOARDS ------------------------------------------------ */

// 02.a. render - ADMIN DASH 
router.get('/admin', function(req, res, next) {

  // Look for gyms listed in gym model: 
  Gym.find({},function(err,retDocs){

    if (err) console.error(err)
    else {

      // console.log("GYM - RETURNED OBJ: ",retDocs)
      // render retrieved list of gyms
      res.render('admin-dash', { gyms: retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})) });
    }

  })

});

// 02.b.  render - Gym Owner DASH 
router.post('/go/gym', function(req,res){
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

      // create mapping from numerical grade # of 5.# stored in database 
      // to display valid climing grades in '5.#' 
      let gradeOptions = [
        { val: 5, name: "5.5"},
        { val: 6, name: "5.6"},
        { val: 7, name: "5.7"},
        { val: 8, name: "5.8"},
        { val: 9, name: "5.9"},
        { val: 10, name: "5.10a"},
        { val: 10.25, name: "5.10b"},
        { val: 10.5, name: "5.10c"},
        { val: 10.75, name: "5.10d"},
        { val: 11, name: "5.11a"},
        { val: 11.25, name: "5.11b"},
        { val: 11.5, name: "5.11c"},
        { val: 11.75, name: "5.11d"},
        { val: 12, name: "5.12a"},
        { val: 12.25, name: "5.12b"},
        { val: 12.5, name: "5.12c"},
        { val: 12.75, name: "5.12d"},
        { val: 13, name: "5.13"},
        { val: 14, name: "5.13+"}
      ]

      const grade_num_to_str = new Map()

      gradeOptions.forEach(function(option) {
        grade_num_to_str.set(option.val, option.name)
      })

      // Array of routes' info to be sent into gym page render: 
      let route_info_arr = retDocs.map(function(doc) {

        // Clean up docs returned from moongoose find({}):
        return {
          route_name: doc.route_name, 
          route_number: doc.route_number,
          setter_grade: grade_num_to_str.get(doc.setter_input.setter_grade), 
          current_grade_avg: grade_num_to_str.get(doc.current_grade_average), 
          current_star_rating: doc.current_star_rating
        }

      }).sort(function(a,b){
        return a.route_number - b.route_number
      })
    
      
      // console.log('Route Info to pass to GYM dash: ', route_info_arr)
      // console.log('Routes in ' + req.body.gym_name + ': ', retDocs)
      res.render('admin-gym-routes', { gym: route_info_arr, gym_name: gym_name, model_name: gym_collection_name});

    }

  })
  
})

/** 03. ADMIN FUNCTIONS ------------------------------------------------ */


/* RENDER ------------------------------------------------ */

// render - new admin form
router.get('/admin-create/admin', function(req,res){

  res.render('admin-create-admin', {})

})

// render - new gym account form 
router.get('/admin-create/gym', function(req,res){
  // TODO: Add new model for each new gym created 

  res.render('admin-create-gym', { });
  // res.json({under_construction: 'page to create new gym '})
})

// render - delete gym account UI
router.post('/admin-delete/gym', function(req,res){

  Gym.find({},function(err,retDocs){

    if (err) console.error(err)
    else {
      // console.info("All Gym Documents - ", retDocs, retDocs.map(doc => doc.gym_name), retDocs.map(doc => doc.model_name) );
      // console.info("All Gym Documents - ", retDocs, retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})))
      
      // render list of gyms
      res.render('admin-gym-delete', { gyms: retDocs.map(doc => ({gym_name: doc.gym_name, model_name: doc.model_name})) });
    }

  })

})

/* CREATE ------------------------------------------------ */

// process - new admin account request
router.post('/admin-create/admin/new-admin', function(req,res){
  console.log('NEW ADMIN - POST - payload: ', req.body);

  
  
  res.json({error: false, message: 'payload seen' })
})

// process - new gym account request
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

      // console.log("Initializing new collection for ",cleanedUpGymName)

      // (2a) initialize a new model/collection for newly added gym:
      let NewGymRoutes = GymRoutes(cleanedUpGymName);

      // (2b) initialize specified number of blank routes 
      if (new_gym_num_routes > 0) {

        // console.log('Need to initialize '+new_gym_num_routes+' route(s) in new Gym: ' + new_gym_name)
        
        initRtArr = initRtArrGen(new_gym_num_routes,new_gym_name)

        // console.log("Insert ", initRtArr, " to collection "+ cleanedUpGymName )
        // console.log(initRtArr.length,new_gym_num_routes, initRtArr.length == new_gym_num_routes)
        if (initRtArr != [] && initRtArr.length == new_gym_num_routes) {

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
                res.json({message: 'Created "'+ new_gym_name +'" with '+ new_gym_num_routes +' climbing route(s)'})
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

// process - add new routes in gym request
router.post('/go-create/gym-route', function(req,res){
  // console.log('NEW ROUTE - POST: ', req.body)

  let target_gym = req.body.gym_collection_name
  let routes_num_to_add = req.body.routes_num_to_add
  let TargetGymModel = GymRoutes(target_gym);

  TargetGymModel.find({},function(err,docsArr){

    if (err) {
      console.error("Scanning existing docs failed: ", err);
      res.status(400).json({error: true, message: 'Scanning exisitng docs in '+ target_gym+'s collection failed'})
    } else {      
      // console.log(target_gym ,'s collection has ',docsArr, 'documents');

      let existing_route_nums = docsArr.map(function(doc){
        return doc.route_number
      });

      // console.log('Existing routes nums Outside -- ',existing_route_nums)

      addRtArr = addRtArrGen(routes_num_to_add,target_gym,existing_route_nums)
      // console.log("Insert ", initRtArr, " to collection "+ target_gym )

      if (addRtArr != [] && addRtArr.length == routes_num_to_add) {

        TargetGymModel.insertMany(addRtArr, function(err,retObj){

          if (err) {
            console.error("Route Write Error: ", err);
            res.status(400).json({error: true, message: 'Init-ing routes in new Gym failed - delete Gym and retry.'})
          } else {      
            // console.log('Added new routes to ', target_gym , retObj)
            res.json({error: false, message: 'Successfully added '+ routes_num_to_add +' route(s)!'})       
          }
        })

      } else {

        res.status(400).json({error:true, message: 'Failed to create Init Routes Array'})

      }
    }

  })

})

// process - edit existing route setter grade request
router.post('/go-edit/route', function(req,res) {

  // console.log('POST - route EDIT: ', req.body)
  
  let route_to_edit = req.body.route_to_edit;
  let gym_route_belongs_to = req.body.gym_collection_name;
  let new_setter_grade = req.body.new_setter_grade;
  let ThisGymModel = GymRoutes(gym_route_belongs_to)

  ThisGymModel.findOneAndUpdate({route_name: route_to_edit}, {setter_input: {setter_grade: new_setter_grade}}, function(err,retObj){

    if (err) {
      console.error('Route Setter Grade update error -- ',err);
      res.json({error: true, message: route_to_edit +' grade update to database failed!'})
    } else {
      // console.log('Route edit returned object: ', retObj)

      /** Update Average Grade: */
      
      // if no climber ratings exist, set average to the setter-grade:
      if (retObj.climber_opinions.length === 0 ) {
        ThisGymModel.findOneAndUpdate({route_name: route_to_edit}, {current_grade_average: new_setter_grade}, function(err,retObj2){

          if (err) {
            console.error('Route Setter Grade Average Grade update error -- ',err);
            res.json({error: true, message: route_to_edit +' avergae grade update to database failed!'})
          } else {
            // console.log('Route edit returned object: ', retObj2)

            res.json({error: false, message: route_to_edit +' Setter-Grade Updated!'})
          }
        })
      }
      // updating average grade when climber opinions do exist:
      // else {
      // 
      // }

    }


  });
  
  

})

/* DELETE ------------------------------------------------ */

// delete - delete gym account 
router.delete('/admin-delete/:gym', function(req,res){
  // console.log('DELETE - gym: ', req.params)

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

router.post('/go-delete/route',function(req,res){
  // console.log('POST - route delete: ',req.body)

  let target_route = req.body.route_to_delete
  let target_gym_collection = req.body.gym_collection_name
  let TargetGymModel = GymRoutes(target_gym_collection)

  TargetGymModel.deleteOne({route_name: target_route}, function(err,retObj){

    if (err) {
      console.error('Route delete error -- ',err);
      res.json({error: true, message: target_route +' delete from '+ target_gym_collection +'s + failed!'})
    } else {
      // console.log('delete one route succeeds -- ', retObj )
      res.json({error: false, message: 'Server responds!'})
    }

  })


  
})

module.exports = router;