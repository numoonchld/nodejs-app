const express = require('express')
const router = express.Router()


// require Mongoose Model files (each with own schema)
const Gyms = require('../models/gym')
const GymRoutes = require('../models/gymroutes')

// create mapping from numerical grade # of 5.# stored in database
// to display valid climing grades in '5.#'

// define grade text to number mapping:
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

// one-to-one map: grade number to string notation
gradeOptions.forEach(function(option) {
  grade_num_to_str.set(option.val, option.name)
})

const grade_str_to_num = new Map()

// one-to-one map: string notation to grade number
gradeOptions.forEach(function(option) {
  grade_str_to_num.set(option.name, option.val)
})

// load helper function to update average grade when called 
let update_avg_grade = require('../helpers/route-avg-grade-update')



/** RENDER ------------------------------------------ */

/** RENDER: list of gyms to choose from */
router.get('/', function (req, res, next) {
  
  Gyms.find({}, function (err, all_gyms_arr) { 

    // console.log('Currently active gyms; ', all_gyms_arr.map((gym) => ({ gym_name: gym.gym_name, model_name: gym.model_name })))

    let gym_render_arr = all_gyms_arr.map((gym) => ({ gym_name: gym.gym_name, model_name: gym.model_name}))
    // console.log(gym_render_arr);

    // List Gyms:
    res.render('climber-gyms-ui', { gyms: gym_render_arr });

  })

});

/** RENDER: list of routes in selected gym */
router.get('/:gym', function(req, res) {

  // console.log('here -- ', req.params);

  Gyms.find({ gym_name: req.params.gym }, function (err, foundGymArr) { 

    if (err) { 
      console.error('error getting gym details: ', err)
      res.json(err).end()

    } else {

      // console.log('found gym collection: ', foundGymArr);

      let thisGym = GymRoutes(foundGymArr[0].model_name)

      thisGym.find({}, function (err, routesArr) {

        if (err) { 
          console.log('error loading collection for ', foundGymArr[0].model_name)
          res.json(err).end()

        } else {

          // console.log('routes in ' + req.params.gym + ':', routesArr)

          let routes_info = routesArr.map((route) => ({
            route_name: route.route_name
          }))

          res.render('climber-routes-ui', { gym_name: req.params.gym, routes: routes_info })


        }
        
        

      })

    }    

  })

})

/** RENDER: climber route dash */
router.get('/:gym/:route', function (req, res) {

  Gyms.find({ gym_name: req.params.gym }, function (err, foundGymArr) { 

    if (err) { 
      console.error('error getting gym details: ', err)
      res.json(err).end()

    } else {

      let thisGym = GymRoutes(foundGymArr[0].model_name)

      thisGym.find({route_name: req.params.route }, function (err, routesArr) {

        if (err) { 
          console.log('error loading collection for ', foundGymArr[0].model_name)
          res.json(err).end()

        } else {

          // console.log('climber selected route info: ', routesArr)

          let climber_avg = routesArr[0].current_grade_average

          if (climber_avg % 1 === 0) {

            res.render('climber-route-dash', {
              gym_name: req.params.gym,
              route_name: req.params.route,
              setter_grade: grade_num_to_str.get(routesArr[0].setter_input.setter_grade),
              average_grade_int: true,
              climber_average_grade: grade_num_to_str.get(routesArr[0].current_grade_average),
              rating: routesArr[0].current_star_rating
            })

          } else {

            res.render('climber-route-dash', {
              gym_name: req.params.gym,
              route_name: req.params.route,
              setter_grade: grade_num_to_str.get(routesArr[0].setter_input.setter_grade),
              average_grade_int: false,
              climber_average_grade: [grade_num_to_str.get(Math.floor(climber_avg)), grade_num_to_str.get(Math.ceil(climber_avg))],
              rating: routesArr[0].current_star_rating
            })

          }

          
          
        }

      })

    }    

  })

})

/** PROCESS ------------------------------------------ */

/** PROCESS: climber agrees setter's grade */
router.post('/:gym/:route', function (req, res) { 

  console.log('climber input for', req.body)

  let gym = req.body.gym,
    route = req.body.route,
    num_grade = grade_str_to_num.get(req.body.grade), //current average grade 
    clientIP = req.body.clientIP,
    ip_exists_flag = false,
    same_grade_flag = false

  
  /** Write Operation */
  
  // find the collection name of gym: 
  Gyms.find({ gym_name: gym }, function (err, foundGymArr) {

    if (err) {
      console.error('error getting gym details: ', err)
      res.status(404).json(err).end()

    } else {
      
      // initiate access to gym route model:
      let thisGym = GymRoutes(foundGymArr[0].model_name)

      // find route in current gym routes collection:
      thisGym.find({ route_name: route }, function (err, routeDoc) {
        
        if (err) {
          console.error('error getting route details: ', err)
          res.status(404).json(err).end()

        } else {
          console.log('extracted route info: ', routeDoc[0])

          let existing_climber_opinions = routeDoc[0].climber_opinions
          ip_exists_flag = existing_climber_opinions.map((opinion) => opinion.climber_IP).indexOf(clientIP) !== -1 ? true : false
          
          console.log('existing climber opinions: ', existing_climber_opinions)
          console.log('IP exists: ', ip_exists_flag)

          // if IP exists already: 
          if (ip_exists_flag) {
            let index_of_exisitng_climber_IP = existing_climber_opinions.map((opinion) => opinion.climber_IP).indexOf(clientIP)
            same_grade_flag = existing_climber_opinions[index_of_exisitng_climber_IP].climber_grade === num_grade ? true : false
          }

          if (ip_exists_flag && same_grade_flag) {
            res.status(200).json({ message: 'Previous response exists! (no changes)' }).end()

          } else if (ip_exists_flag && !same_grade_flag) { 

            thisGym.updateOne(
              { route_name: route },
              {
                $set: { "climber_opinions.$[opinion].climber_grade": num_grade}
              }, {
                arrayFilters: [{"opinion.climber_IP": clientIP}]
              },function (err, callback) { 
                
                if (err) {
                  console.error('error setting route details: ', err)
                  res.status(404).json(err).end()

                } else {
                  console.log('updated climber grading: ', callback)
                  if (callback.ok === 1) {

                    update_avg_grade(gym, route)
                      .then(function (data) {
                        res.status(200).json({ message: 'Registered climber opinion!' }).end()

                      }).catch(function (data) { 
                        res.status(500).json({ message: 'Failed to register climber opinion!' }).end()

                      })

                  }
                }
              }
            )

          } else if (existing_climber_opinions.length === 0 || !ip_exists_flag) {

            thisGym.updateOne({
              route_name: route
            },
              {
                $push: {
                  climber_opinions: { climber_IP: clientIP, climber_grade: num_grade }
                }
              },
              function (err, callback) {
            
                if (err) {
                  console.error('error getting route details: ', err)
                  res.status(404).json(err).end()

                } else {
                  console.log('updated climber grading: ', callback)
                  if (callback.ok === 1) {

                    update_avg_grade(gym, route)
                      .then(function (data) {
                        res.status(200).json({ message: 'Registered climber opinion!' }).end()

                      }).catch(function (data) { 
                        res.status(500).json({ message: 'Failed to register climber opinion!' }).end()

                      })
                    
                    
                  }
                  
                }

              })

          } else {
            res.status(500).json({ message: 'Unknown Error - response not recorded!' }).end()
            
          }

        }
      })

    }
    // res.json({})
  })

})

/** PROCESS: climber disagrees setter's grade */
router.post('/:gym/:route/disagree', function (req, res) { 
  console.log('Climber disagrees: ', req.body);

  let gym = req.body.gym,
    route = req.body.route,
    new_grade = req.body.climber_input_grade, // this is already numerical
    clientIP = req.body.clientIP,
    ip_exists_flag = false,
    same_grade_flag = false
  
  // find the collection name of gym: 
  Gyms.find({ gym_name: gym }, function (err, foundGymArr) {

    if (err) {
      console.error('error getting gym details: ', err)
      res.status(404).json(err).end()

    } else {
      
      // initiate access to gym route model:
      let thisGym = GymRoutes(foundGymArr[0].model_name)

      // find route in current gym routes collection:
      thisGym.find({ route_name: route }, function (err, routeDoc) { 

        if (err) {
          console.error('error getting route details: ', err)
          res.status(404).json(err).end()

        } else {
        
          console.log('extracted route info: ', routeDoc[0])

          let existing_climber_opinions = routeDoc[0].climber_opinions
          ip_exists_flag = existing_climber_opinions.map((opinion) => opinion.climber_IP).indexOf(clientIP) !== -1 ? true : false

          console.log('existing climber opinions: ', existing_climber_opinions)
          console.log('IP exists: ', ip_exists_flag)

          // check if IP has already left a grading: 
          if (ip_exists_flag) {
            let index_of_exisitng_climber_IP = existing_climber_opinions.map((opinion) => opinion.climber_IP).indexOf(clientIP)
            same_grade_flag = existing_climber_opinions[index_of_exisitng_climber_IP].climber_grade === new_grade ? true : false
          }

          if (ip_exists_flag && same_grade_flag) {
            res.status(200).json({ message: 'Previous response exists! (no changes made)' }).end()

          } else if (ip_exists_flag && !same_grade_flag) {

            thisGym.updateOne(
              { route_name: route },
              {
                $set: { "climber_opinions.$[opinion].climber_grade": new_grade}
              }, {
                arrayFilters: [{"opinion.climber_IP": clientIP}]
              },function (err, callback) { 
                
                if (err) {
                  console.error('error setting route details: ', err)
                  res.status(404).json(err).end()

                } else {
                  console.log('updated climber grading: ', callback)
                  if (callback.ok === 1) {
                    
                    update_avg_grade(gym, route)
                      .then(function (data) { 
                        if (data.updated) res.status(200).json({ message: 'Registered climber opinion!' }).end()

                      }).catch(function (data) { 
                        res.status(500).json({ message: 'Failed to register climber opinion!' }).end()

                      })
                    
                  }

                }
              }
            )

          } else if (existing_climber_opinions.length === 0 || !ip_exists_flag ) { 

            thisGym.updateOne({
              route_name: route
            },
              {
                $push: {
                  climber_opinions: { climber_IP: clientIP, climber_grade: new_grade }
                }
              },
              function (err, callback) {
            
                if (err) {
                  console.error('error setting route details: ', err)
                  res.status(404).json(err).end()

                } else {
                  console.log('updated climber grading: ', callback)

                  if (callback.ok === 1) {
                    
                    update_avg_grade(gym, route)
                      .then(function (data) { 
                        console.log('user router: ', data);
                        if (data.updated) res.status(200).json({ message: 'Registered climber opinion!' }).end()

                      }).catch(function (data) { 
                        res.status(500).json({ message: 'Failed to register climber opinion!' }).end()

                      })
                    
                  }

                }

              })

          } else { 
            
            res.status(500).json({ message: 'Unknown Error - response not recorded!' }).end()
            
          }

        }

      })
    }
  })
})

/** PROCESS: climber rating update */


/** EXPORT ----------------------------------------- */
module.exports = router;
