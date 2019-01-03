$("#new-route-form").submit(function(event){

    console.log("NEW ROUTE - FORM DATA: " ,$(this).serializeArray());

    $.ajax({
        url: '/admin-create/gym-route',
        type: 'POST',
        data: $(this).serializeArray(),
        success: function(data){
            console.log('POST - new route success: ',data)
        },
        error: function(errObj,errMsg){
            console.log(errMsg);
        }
    })
    event.preventDefault();

})