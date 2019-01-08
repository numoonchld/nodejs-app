$("#new-admin-form").submit(function(event){    
        
    // console.log("NEW GYM - FORM DATA: " ,$(this).serializeArray());

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success mx-3',
        cancelButtonClass: 'btn btn-danger mx-3',
        buttonsStyling: false,
    })

    let incoming_payload = $(this).serializeArray()
    let outgoing_payload = {
        username: incoming_payload[0].value
    }
    
    if (incoming_payload[1].value === incoming_payload[2].value) {

        outgoing_payload.password = incoming_payload[2].value

        $.ajax({
            type: "POST",
            url: '/admin-create/admin/new-admin',
            data: outgoing_payload,
            success: function(data) {
    
                console.log('POST returned - ' + JSON.stringify(data))
                
                swalWithBootstrapButtons({
                    title: 'POST-ed',
                    text: data.message,
                    type: 'success',
                    confirmButtonText: 'Done'
                })
    
                
            },
            timeout: 6500,
            error: function(err,errMsg,thirdThing) {
                // console.error(err)
                // console.log(err.responseJSON)
                // console.log(errMsg),
                // console.log(thirdThing),   
                
                if (err.responseJSON.message === 'Duplicate') {
                 
                    swalWithBootstrapButtons({
                        title: 'DUPLICATE',
                        text: 'Gym with the same name found, new one not created!',
    
                        type: 'error',
                        confirmButtonText: 'Done'
                    })
    
                } else if (err.responseJSON.message) {
                    
                    swalWithBootstrapButtons({
                        title: "POST-n't",
                        text: err.responseJSON.message,
                        type: 'error',
                        confirmButtonText: 'Done'
                    })
    
                } else {
    
                    swalWithBootstrapButtons({
                        title: "POST-n't",
                        text: errMsg,
                        type: 'error',
                        confirmButtonText: 'Done'
                    })
    
                }
                
            }
        })


    } else {

        swalWithBootstrapButtons({
            title: "MISMATCH",
            text: 'Entered passwords are not the same!',
            type: 'error',
            confirmButtonText: 'Retry'
        })

    }

    event.preventDefault();
    
})

$('#confirm-password').on('paste', false);