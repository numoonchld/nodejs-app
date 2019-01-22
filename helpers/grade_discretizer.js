// takes a grade average that is unmappable to grade strings
//  find the nearest discete grade and returns that

module.exports = function (non_discrete_grade) { 

    // console.log('Current average: ', non_discrete_grade)
    
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
    ],
        distance_from_input = [],
        returnArr = []
    
    gradeOptions.forEach((option,index) => { 
        distance_from_input[index] = Math.abs(option.val - non_discrete_grade)
    })
    
    // console.log(non_discrete_grade, distance_from_input, distance_from_input.indexOf(Math.min(...distance_from_input)))

    let shortest_distance_indices = [];
    let shortest_index = distance_from_input.indexOf(Math.min(...distance_from_input));
    
    while (shortest_index !== -1) { 
        shortest_distance_indices.push(shortest_index)
        shortest_index = distance_from_input.indexOf(Math.min(...distance_from_input),shortest_index+1 )
    }
    
    // console.log(shortest_distance_indices)

    shortest_distance_indices.forEach(dist_index => (
        returnArr.push( gradeOptions[dist_index].name )
    ))
    
    // console.log(returnArr)
    
    return returnArr


}