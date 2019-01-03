$("#new-gym-form").submit(function(event){    

    event.preventDefault();
    
    console.log("NEW GYM FORM DATA: " ,$(this).serializeArray());
    //- .ajax()
    
})