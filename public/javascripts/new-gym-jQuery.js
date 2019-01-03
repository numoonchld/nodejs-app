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
            
            swal({
                title: 'POST-ed',
                text: 'ajax returned success',
                type: 'success',
                confirmButtonText: 'Done'
            })
        },
        error: function() {
            swal({
                title: "POST-n't",
                text: 'ajax returned error',
                type: 'error',
                confirmButtonText: 'Done'
            })
        }
    })

    event.preventDefault();
    
})