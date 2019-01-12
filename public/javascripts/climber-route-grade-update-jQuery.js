const swalWithBootstrapButtons = Swal.mixin({
    confirmButtonClass: 'btn btn-success mx-3',
    cancelButtonClass: 'btn btn-danger mx-3',
    buttonsStyling: false,
})

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

$('#agree').submit(function () { 
    
    // console.log("Climber agrees with setter grading -- form data: " , $(this).serializeArray())

    let gym = $(this).serializeArray()[0].value
    let route = $(this).serializeArray()[1].value
    let grade = $(this).serializeArray()[2].value
    let clientIP = ''

    $.getJSON("https://api.ipify.org?format=json", function (data) { 

        // console.log(data.ip)
        clientIP = data.ip;

        let post_payload = {
            gym: gym,
            route: route,
            grade: grade,
            clientIP: clientIP
        }       
    
        $.ajax({
            url: '/users/' + gym + '/' + route,
            type: 'POST',
            data: post_payload,
            success: function(data){
                console.log('POST - climber agreed - success: ', data)
                
                swalWithBootstrapButtons(
                    'Noted',
                    data.message,
                    'success'
                ).then(function(result){
                
                    if (result.value) {
                        location.reload(true)
                    }
    
                })
                

            },
            error: function(errObj,errMsg,errStr){
                console.log(errObj);

                swalWithBootstrapButtons(
                    'Nope',
                    errObj.responseJSON.message,
                    'error'
                )
                

            }
        })
        
    })    

    event.preventDefault()
})

$('#disagree').submit(function () { 

    console.log("Climber disagrees with setter grading -- form data: ", $(this).serializeArray())

    const grade_str_to_num = new Map()

    // one-to-one map: string notation to grade number
    gradeOptions.forEach(function (option) {
        grade_str_to_num.set(option.name, option.val)
    })

    let gym = $(this).serializeArray()[0].value
    let route = $(this).serializeArray()[1].value
    let grade = grade_str_to_num.get($(this).serializeArray()[2].value)
    let clientIP = ''

    console.log(gym, route,grade, clientIP);

    $.getJSON("https://api.ipify.org?format=json", function (data) { 

        const inputOptions = new Map()

        gradeOptions.forEach(function(option) {
            if (option.val !== grade ) inputOptions.set(option.val, option.name)
        })

        console.log(data.ip)
        clientIP = data.ip

        swalWithBootstrapButtons({
            title: "Input Grade",
            type: 'info',
            showCancelButton: true,
            confirmButtonText: 'Grade',
            text: 'How do you grade this route?',
            input: 'select',
            inputOptions,
            showLoaderOnConfirm: true,
            preConfirm: function (selectedValue) {

                event.preventDefault()

                console.log("preConfirm: ", selectedValue);

                let payload = {
                    gym: gym,
                    route: route,
                    clientIP: clientIP,
                    climber_input_grade: selectedValue

                }

                return $.ajax({
                    url: '/users/'+ gym +'/'+ route +'/disagree',
                    type: 'POST',
                    data: payload,
                    success: function (data) {

                        event.preventDefault()

                        console.log('POST - AJAX success: ', data)

                        return data
                    },
                    timeout: 6500,
                    error: function (errObj, errMsg, errText) {

                        event.preventDefault()

                        error = new Error(errText)
                        console.log("AJAX Error:", error)
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                        throw error
                    }
                })

            }

        }).then(function(result){

            console.log("then: ",result);
    
            if (result.value && !result.value.error) {            
    
                swalWithBootstrapButtons(
                    'Saved',
                    result.value.message,
                    'success'
                ).then(function(result){
                    
                    if (result.value) {
                        location.reload(true)
                    }
    
                })
                
    
            } else if (result.dismiss === Swal.DismissReason.cancel) {// Read more about handling dismissals
                
                swalWithBootstrapButtons(
                  'Cancelled',
                  'Dropped grade updation!',
                  'error'
                )
    
            } else if (result.value && result.value.error) {
    
                Swal(
                    'Error',
                    result.value.message,
                    'error'
                  )
    
            }
        })    
        
    })

    event.preventDefault()
    
})