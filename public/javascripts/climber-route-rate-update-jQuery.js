$('#rate').submit(function (event) { 

    // console.log("Climber agrees with setter grading -- form data: " , $(this).serializeArray())

    let gym = $(this).serializeArray()[0].value
    let route = $(this).serializeArray()[1].value
    let clientIP = ''

    $.getJSON("https://api.ipify.org?format=json", function (data) { 

        // console.log(data.ip)
        clientIP = data.ip;

        let post_payload = {
            gym: gym,
            route: route,
            clientIP: clientIP
        }       

        console.log(post_payload);

        ratingOptions = [
            { val: 4, name: "4" },
            { val: 3, name: "3" },
            { val: 2, name: "2" },
            { val: 1, name: "1" },
            { val: 0, name: "0" },
        ]
        
        const rating_num_to_str = new Map()

        // one-to-one map: string notation to grade number
        ratingOptions.forEach(function (option) {
            rating_num_to_str.set(option.name, option.val)
        })

        swalWithBootstrapButtons({
            title: "Rate",
            type: 'info',
            showCancelButton: true,
            confirmButtonText: 'Grade',
            html:  `<p> How fun is this route? </p>
                    <br>
                    <p> 0 = sucks <p>
                    <p> 4 = awesome! </p>`,
            input: 'select',
            inputOptions: rating_num_to_str,
            showLoaderOnConfirm: true,
            preConfirm: function (selectedValue) {

                event.preventDefault()

                console.log("preConfirm: ", selectedValue);

                let payload = {
                    gym: gym,
                    route: route,
                    clientIP: clientIP,
                    climber_input_rating: selectedValue

                }

                return $.ajax({
                    url: '/users/'+ gym +'/'+ route +'/rate',
                    type: 'POST',
                    data: payload,
                    success: function (data) {

                        console.log('POST - AJAX success: ', data)
                        return data
                    },
                    timeout: 6500,
                    error: function (errObj, errMsg, errText) {

                        // event.preventDefault()

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
                    'Rated',
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