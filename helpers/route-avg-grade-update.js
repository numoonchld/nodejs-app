// require Mongoose Model files (each with own schema)
const Gyms = require('../models/gym')
const GymRoutes = require('../models/gymroutes')



module.exports = function (gym_name, route_name) {     
    
    console.log("Helper started: ", gym_name, route_name) 

    // find the collection name of gym: 
    Gyms.find({ gym_name: gym_name }, function (err, foundGymArr) { 
        
        if (err) {
            console.log('Helper function error: ', err)

        } else { 
            
            // initiate access to gym route model:
            let thisGym = GymRoutes(foundGymArr[0].model_name)

            // find route in current gym routes collection:
            thisGym.find({ route_name: route }, function (err, routeDocArr) {

                if (err) {
                    console.error('error getting route details: ', err)
                    // res.status(404).json(err).end()
          
                } else {
                  
                    console.log('helper function extracted route info: ', routeDocArr[0])

                    if (routeDocArr[0].climber_opinions.length > 0) {
                        
                        let updated_avg_grade = routeDocArr[0].setter_input.setter_grade

                        for (let opinion in climber_opinions) {
                            console.log('opinion -- ', opinion)
                            updated_avg_grade += opinion.climber_grade;
                        }

                        updated_avg_grade /= routeDocArr[0].climber_opinions.length + 1

                        thisGym.updateOne(
                            { route_name: route_name },
                            { current_grade_average: updated_avg_grade },
                            function (err, ack) {
                                if (err) console.log('Helper function failed to update average!', err)
                                else console.log('Helper function updates average successfully', ack)
                                
                                // callback returns climber_opinions exist flag
                                return { updated: true, climber_opinions: true }
                            }
                        )

                    } else if (routeDocArr[0].climber_opinions.length === 0) {

                        thisGym.updateOne(
                            { route_name: route_name },
                            { current_grade_average: routeDocArr[0].setter_input.setter_grade },
                            function (err, ack) {
                                if (err) console.log('Helper function failed to update average!', err)
                                else console.log('Helper function updates average successfully', ack)
                                
                                // callback returns with no climber_opinions exist flag
                                return { updated: true, climber_opinions: false }
                            }
                        )

                    } else { 

                        return { updated: false, climber_opinions: false }

                    }

                }

            })
        }

    })

}