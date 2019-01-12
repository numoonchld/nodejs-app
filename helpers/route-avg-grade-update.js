// require Mongoose Model files (each with own schema)
const Gyms = require('../models/gym')
const GymRoutes = require('../models/gymroutes')

module.exports = function (gym_name, route_name) {

    console.log("Helper started: ", gym_name, route_name) 
    
    return new Promise(function (resolve, reject) { 
        
        // find the collection name of gym: 
        Gyms.find({ gym_name: gym_name }, function (err, foundGymArr) { 
        
        if (err) {
            console.log('Helper function error: ', err)
            reject({ updated: false, climber_opinions: false, error: err }) 

        } else { 
            
            // initiate access to gym route model:
            let thisGym = GymRoutes(foundGymArr[0].model_name)

            // find route in current gym routes collection:
            thisGym.find({ route_name: route_name }, function (err, routeDocArr) {

                if (err) {
                    console.error('error getting route details: ', err)
                    reject({ updated: false, climber_opinions: false, error: err }) 
          
                } else {
                  
                    console.log('helper function extracted route info: ', routeDocArr[0])

                    if (routeDocArr[0].climber_opinions.length > 0) {
                        
                        let updated_avg_grade = routeDocArr[0].setter_input.setter_grade
                        
                        console.log('old grade average: ', updated_avg_grade)

                        let climber_opinion_sum = routeDocArr[0].climber_opinions.slice().map((opinion) => (opinion.climber_grade)).reduce((a, b) => a + b)
                        
                        updated_avg_grade = (updated_avg_grade + climber_opinion_sum) / (routeDocArr[0].climber_opinions.length + 1)

                        console.log('new grade average: ', updated_avg_grade)

                        thisGym.updateOne(
                            { route_name: route_name },
                            { current_grade_average: updated_avg_grade },
                            function (err, ack) {

                                if (err) {
                                    console.log('Helper function (path a) failed to update average!', err)
                                    reject({ updated: false, climber_opinions: false, error: err }) 
                                    
                                }
                                else {
                                    console.log('Helper function (path a) updates average successfully', ack)
                                    
                                    // callback returns climber_opinions exist flag
                                    resolve({ updated: true, climber_opinions: true }) 

                                }
                                
                                
                            }
                        )

                    } else if (routeDocArr[0].climber_opinions.length === 0) {

                        thisGym.updateOne(
                            { route_name: route_name },
                            { current_grade_average: routeDocArr[0].setter_input.setter_grade },
                            function (err, ack) {
                                if (err) {
                                    console.log('Helper function (path b) failed to update average!', err)
                                    reject({ updated: false, climber_opinions: false, error: err }) 

                                }
                                else {
                                    console.log('Helper function (path b) updates average successfully', ack)
                                    // callback returns with no climber_opinions exist flag
                                    resolve({ updated: true, climber_opinions: false }) 

                                }
                            }
                        )

                    } else {
                        reject({ updated: false, climber_opinions: false }) 

                    }

                }

            })
        }

    })



    })

}