$(document).ready(function () {

    /*events*/
    $("#CreateBusinessAccount").click(function() {

        createBusinessAccount();

    });

    /*validation*/
    /* validations */
    $("#businessRegisterForm").validate({
        rules: {
            // simple rule, converted to {required:true}
            firstName: {
                LatinNames: true,
                required: true
            },
            lastName: {
                LatinNames: true,
                required: true
            },
            businessName: {
                required: true
            },
            taxId: {
                required: true
            },
            address: {
                required: true
            },
            city: {
                required: true
            },
            postalCode: {
                required: true
            },
            country: {
                required: true
            },
            phone: {
                required: true
            }
        }

    });


});

function createBusinessAccount() {

    $("#businessRegisterForm").validate();
    if (!$("#businessRegisterForm").valid()) {return;}

    var businessData = $('#businessRegisterForm').serializeObject();

    var data = JSON.stringify(businessData);

    $.ajax({
        type:'POST',
        url:'/business/register',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: {newBusiness: data},
        success:function(result){
            if(result.status == 200) {
                if (result.success == true){
                    if (result.webmaster == true)
                        window.location = "/business/dashboard";
                }
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });

}
