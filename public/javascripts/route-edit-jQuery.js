$(".edit-route-form").submit(function(event){

    // console.log("NEW ROUTE - FORM DATA: " ,$(this).serializeArray());

    const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success mx-3',
        cancelButtonClass: 'btn btn-danger mx-3',
        buttonsStyling: false,
    })

    let gym_route_belongs_to = $(this).serializeArray()[0].value;
    let route_name = $(this).serializeArray()[1].value;
    let current_setter_grade = $(this).serializeArray()[2].value;
    

    let gradeOptions = [
        { val: 5, name: "5.5"},
        { val: 6, name: "5.6"},
        { val: 7, name: "5.7"},
        { val: 8, name: "5.8"},
        { val: 9, name: "5.9"},
        { val: 10, name: "5.10a"},
        { val: 10.25, name: "5.10b"},
        { val: 10.5, name: "5.10c"},
        { val: 10.75, name: "5.10d"},
        { val: 11, name: "5.11a"},
        { val: 11.25, name: "5.11b"},
        { val: 11.5, name: "5.11c"},
        { val: 11.75, name: "5.11d"},
        { val: 12, name: "5.12a"},
        { val: 12.25, name: "5.12b"},
        { val: 12.5, name: "5.12c"},
        { val: 12.75, name: "5.12d"},
        { val: 13, name: "5.13"},
        { val: 14, name: "5.13+"}
    ]

    
    const inputOptions = new Map()
    gradeOptions.forEach(function(option) {
        if (option.name !== current_setter_grade ) inputOptions.set(option.val, option.name)
    })

    swalWithBootstrapButtons({
        title: "Edit Setter's Grade for " + route_name ,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save',
        html: 
            "<h5> Current Setter's Grade </h5> <h1> " + current_setter_grade + "</h1> " +
            "<hr><br> Update Setter's Grade: ",
        input: 'select',
        inputOptions,
        showLoaderOnConfirm: true,
        preConfirm: function(selectedValue) {

            console.log("preConfirm: ", selectedValue);

            let new_grade_payload = {
                gym_collection_name: gym_route_belongs_to,
                route_to_edit: route_name,
                current_setter_grade: current_setter_grade,
                new_setter_grade: selectedValue
            }

            return $.ajax({
                url: '/go-edit/route',
                type: 'POST',
                data: new_grade_payload,
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
                'Saved',
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
              'Dropped editing.',
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


    

    event.preventDefault();

})
