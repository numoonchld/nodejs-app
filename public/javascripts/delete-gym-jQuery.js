$(".delete-gym-form").submit(function(event){

    event.preventDefault();

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success mx-3',
        cancelButtonClass: 'btn btn-danger mx-3',
        buttonsStyling: false,
    })

    // console.log("DELETE GYM - FORM DATA: " , $(this).serializeArray());

    let gym_name =  $(this).serializeArray()[0].value;
    
    swalWithBootstrapButtons({
        title: 'Sure?',
        text: 'Deleting ' + gym_name + ' is not reversible!',
        type: 'warning',
        confirmButtonText: 'Continue',
        showCancelButton: true,
        cancelButtonText: 'Back',
        reverseButtons: false,
        showLoaderOnConfirm: true,                
        preConfirm: function(swal_input) {

            // console.log("pC inp: ",swal_input)

            if (swal_input == true) {

                return $.ajax({
                    url: '/admin-delete/' + gym_name ,
                    type: 'DELETE',
                    success: function(data){
                        // console.log('DELETE - gym response: ',data)
                        return data;
                    },
                    timeout: 6500,
                    error: function(errObj,errMsg){
                        // console.log('DELETE - gym error: ',errMsg);

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


        }
    }).then( function(result) {

        // console.log('Here---',result)

        if (result.value && !result.value.error) {

            swalWithBootstrapButtons(
                'Deleted!',
                'Gym database has been deleted.',
                'success'
            ).then(function(result){
                
                if (result.value) {
                    location.reload(true)
                }

            })
            

        } else if (result.dismiss === Swal.DismissReason.cancel) {// Read more about handling dismissals
            
            swalWithBootstrapButtons(
              'Cancelled',
              'Gym database is safe :)',
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