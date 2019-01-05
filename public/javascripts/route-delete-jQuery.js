$(".delete-route-form").submit(function(event){

    console.log("DELETE ROUTE - FORM DATA: " ,$(this).serializeArray());

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success mx-3',
        cancelButtonClass: 'btn btn-danger mx-3',
        buttonsStyling: false,
    })

    const target_gym_collection = $(this).serializeArray()[0].value
    const target_route_name = $(this).serializeArray()[1].value
    console.log("To add routes to Gym collection: ", target_gym_collection, target_route_name)

    // const optionSeedArr = [...Array(100).keys()]

    // const inputOptions = new Map()
    // optionSeedArr.forEach(function(option) {
    //     if (option > 0 ) inputOptions.set(option, option.toString())
    // })

    // // console.log('inputoptions: ', optionSeedArr);
    
    swalWithBootstrapButtons({
        title: 'Sure?',
        text: "Deleting '" + target_route_name + "' is not reversible!",
        type: 'warning',
        confirmButtonText: 'Continue',
        showCancelButton: true,
        cancelButtonText: 'Back',
        reverseButtons: false,
        showLoaderOnConfirm: true,                
        preConfirm: function(selectedValue) {

            console.log("preConfirm: ", selectedValue);

            let delete_route_payload = {
                gym_collection_name: target_gym_collection,
                route_to_delete: target_route_name
            }

            return $.ajax({
                url: '/admin-delete/route',
                type: 'POST',
                data: delete_route_payload,
                success: function(data){
                    // console.log('DELETE - gym response: ',data)
                    return data;
                },
                timeout: 6500,
                error: function(errObj,errMsg,errStr){
                    console.log('DELETE - route error: ',errStr);

                    // Swal.showValidationMessage(
                    //     `Request failed: ${errMsg}`
                    //   )

                    throw new Error(errMsg)

                    // swalWithBootstrapButtons(
                    //     'Error!',
                    //     'Gym database failed - '+ errMsg,
                    //     'error'
                    // )                        

                }
            })

        }
    }).then( function(result) {

        // console.log('Here---',result)

        if (result.value && !result.value.error) {

            swalWithBootstrapButtons(
                'Deleted',
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
              'Route is safe :)',
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