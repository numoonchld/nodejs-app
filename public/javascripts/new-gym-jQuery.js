$("#new-gym-form").submit(function(event){    
        
    console.log("NEW GYM - FORM DATA: " ,$(this).serializeArray());
    
    // $.post('/admin-create/gym/new-gym', $(this).serializeArray() ).done( function(data){
    //     console.log(data);
    // })

    $.ajax({
        type: "POST",
        url: '/admin-create/gym/new-gym',
        data: $(this).serializeArray(),
        success: function(data) {
            // alert('POST returned - ' + JSON.stringify(data))
            swal({
                title: 'POST-ed',
                text: 'ajax returend success',
                type: 'info',
                confirmButtonText: 'Done'
            })
        }
    })

    event.preventDefault();
    
})