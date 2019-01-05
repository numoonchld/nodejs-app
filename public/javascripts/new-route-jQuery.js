$("#new-route-form").submit(function(event){

    console.log("NEW ROUTE - FORM DATA: " ,$(this).serializeArray())

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success mx-3',
        cancelButtonClass: 'btn btn-danger mx-3',
        buttonsStyling: false,
    })

    const target_gym_collection = $(this).serializeArray()[0].value
    const target_gym_name = $(this).serializeArray()[1].value
    console.log("To add routes to Gym collection: ", target_gym_collection, target_gym_name)

    const optionSeedArr = [...Array(100).keys()]

    const inputOptions = new Map()
    optionSeedArr.forEach(function(option) {
        if (option > 0 ) inputOptions.set(option, option.toString())
    })

    // console.log('inputoptions: ', optionSeedArr);
    

    swalWithBootstrapButtons({
        title: "Add routes to " + target_gym_name ,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Add',
        text: 'How many routes would you like to add?',
        input: 'select',
        inputOptions,
        showLoaderOnConfirm: true,
        preConfirm: function(selectedValue) {

            console.log("preConfirm: ", selectedValue);

            let add_routes_payload = {
                gym_collection_name: target_gym_collection,
                routes_num_to_add: selectedValue
            }

            return $.ajax({
                url: '/admin-create/gym-route',
                type: 'POST',
                data: add_routes_payload,
                success: function(data){
                    console.log('POST - AJAX success: ',data)
                    return data
                },
                timeout: 6500,
                error: function(errObj,errMsg, errText){
                    error = new Error(errText)
                    console.log("AJAX Error:",error)
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
                'Added',
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
              'Dropped adding routes.',
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

    // $.ajax({
    //     url: '/admin-create/gym-route',
    //     type: 'POST',
    //     data: $(this).serializeArray(),
    //     success: function(data){
    //         console.log('POST - new route success: ',data)
    //     },
    //     error: function(errObj,errMsg){
    //         console.log(errMsg);
    //     }
    // })

    event.preventDefault();

})

