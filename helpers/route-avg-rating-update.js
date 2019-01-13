// require Mongoose Model files (each with own schema)
const Gyms = require('../models/gym')
const GymRoutes = require('../models/gymroutes')

module.exports = function (gym_name, route_name) {

    console.log("Rating-Helper started: ", gym_name, route_name) 
    
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
                    
                        console.log('Rating-Helper function extracted route info: ', routeDocArr[0])

                        if (routeDocArr[0].climber_opinions.length > 0) {
                                    
                            console.log('old average rating: ', routeDocArr[0].current_star_rating)

                            let climber_opinion_rating_sum = routeDocArr[0].climber_opinions.slice().map((opinion) => (opinion.climber_rating)).reduce((a, b) => a + b)
                            
                            updated_avg_rating = climber_opinion_rating_sum / (routeDocArr[0].climber_opinions.slice().filter((opinion) => opinion.current_star_rating !== null).length)

                            console.log('new average rating: ', updated_avg_rating)

                            thisGym.updateOne(
                                { route_name: route_name },
                                { current_star_rating: updated_avg_rating },
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
                                { current_star_rating: routeDocArr[0].current_star_rating },
                                function (err, ack) {
                                    if (err) {
                                        console.log('Helper function (path b) failed to update average!', err)
                                        reject({ updated: false, climber_opinions: false, error: err })

                                    }
                                    else {

                                        console.log('Rating-Helper function (path b) updates average successfully', ack)
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