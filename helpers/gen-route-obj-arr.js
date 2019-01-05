module.exports = function(num_of_routes_to_init,new_gym_name,offset=1) {

let routes_array = [];

for (let rtNum = 0; rtNum < num_of_routes_to_init; rtNum++) {

    routes_array.push({route_name: 'Route ' + (rtNum+offset), gym_name: new_gym_name, setter_input: {setter_grade: 5}, current_grade_average: 5, current_star_rating: 4 })
}

return routes_array;

}