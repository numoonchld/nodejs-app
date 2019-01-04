module.exports = function(num_of_routes_to_init,new_gym_name) {

let routes_array = [];
console.log('Heyy')
for (let rtNum = 0; rtNum < num_of_routes_to_init; rtNum++) {
    console.log(rtNum);
    routes_array.push({route_name: 'Route ' + (rtNum+1), gym_name: new_gym_name, setter_input: {setter_grade: '5'} })
}
console.log(routes_array)
console.log('Byee')
return routes_array;

}