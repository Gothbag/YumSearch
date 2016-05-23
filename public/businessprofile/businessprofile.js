$(document).ready(function () {
    /* validations */
    $("#addRatingForm").validate({
        rules: {
            // simple rule, converted to {required:true}
            ratingComment: {
                required: true
            },
            ratingComment: {
                required: true
            }
        }

    });

    $("#rateBusiness").click(function () {
        rateBusiness();
    });

});

function rateBusiness() {
    $("#addRatingForm").validate();
    if (!$("#addRatingForm").valid()) {return;}

    $.ajax({
        type:'POST',
        url:'/ratings/post',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({score: $("#ratingScore").val(), comment: $('#ratingComment').val(), businessId: businessId}),
        success:function(result){
            if(result.status == 200) {
                if (result.success == true){
                    if (result.webmaster == true) {
                        window.location = "/adminDash";
                    } else if (result.business == true) {
                        window.location = "/business/dashboard"
                    } else {
                        window.location = "/";
                    }
                } else {
                    $("#LoginUserNotValidated").removeClass("hidden");
                }
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}
