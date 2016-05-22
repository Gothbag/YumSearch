$(document).ready(function () {
    /* validations */
    $("#addRatingForm").validate({
        rules: {
            // simple rule, converted to {required:true}
            loginPwd: {
                minlength: 6,
                required: true
            },
            loginEmail: {
                required: true
            }
        }

    });

});

