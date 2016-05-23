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
        failure: function (err) {
            dataError(err);
        },
        success: function (result) {
            console.log("paco");
            if (result.status == 200 && result.success == true){
                dataSuccess("Rating saved succesfully.");
          }

      }
    });
}
