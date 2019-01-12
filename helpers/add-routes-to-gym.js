module.exports = function(num_of_routes_to_add,gym_of_routes,existing_route_numbers) {

    let routes_array = []
    let added_num = 0
    let route_name_count = 1

    // console.log('Existing routes nums -- ',existing_route_numbers)

    while (added_num < num_of_routes_to_add) {
        
        console.log('')

        if (existing_route_numbers.indexOf(route_name_count) === -1) {

            routes_array.push({
                route_name: 'Route ' + (route_name_count),
                route_number: route_name_count,
                gym_name: gym_of_routes,
                setter_input: { setter_grade: 5 },
                current_grade_average: 5,
                current_star_rating: 4
            })

            added_num++
            route_name_count++

        } else {
            route_name_count++
        }

    }

    // console.log("Helper output: ", routes_array)
    return routes_array;

}