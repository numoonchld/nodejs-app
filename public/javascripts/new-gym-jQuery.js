$("#new-gym-form").submit(function(event){    
        
    // console.log("NEW GYM - FORM DATA: " ,$(this).serializeArray());
    
    // $.post('/admin-create/gym/new-gym', $(this).serializeArray() ).done( function(data){
    //     console.log(data);
    // })

    $.ajax({
        type: "POST",
        url: '/admin-create/gym/new-gym',
        data: $(this).serializeArray(),
        success: function(data) {
            console.log('POST returned - ' + JSON.stringify(data))
            
            if (data.message === 11000) {
                swal({
                    title: 'DUPLICATE',
                    text: 'Gym with the same name found, new one not created!',

                    type: 'error',
                    confirmButtonText: 'Done'
                })
            } else {
                swal({
                    title: 'POST-ed',
                    text: data.message,
                    type: 'success',
                    confirmButtonText: 'Done'
                })
            }
            
        },
        timeout: 6500,
        error: function(err,errMsg,thirdThing) {
            // console.error(err)
            // console.log(errMsg),
            // console.log(thirdThing),            
            swal({
                title: "POST-n't",
                text: errMsg,
                type: 'error',
                confirmButtonText: 'Done'
            })
        }
    })

    event.preventDefault();
    
})