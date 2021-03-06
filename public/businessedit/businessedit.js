$(document).ready(function () {

    /*events*/
    $("#Save").click(function () {

        save();

    });

    /* validation */
     $("#form2").validate({
        rules: {
            // simple rule, converted to {required:true}
            oldPassword: {
                skip_or_fill_minimum: [3, "Password"],
                minlength: 6
            },
            password: {
                minlength: 6
            },
            confirmPassword: {
                minlength: 6,
                equalTo: "#password"
            },
            registerPwdConfirm: {
                required: true,
                equalTo: "#registerPwd",
                min: 6
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            confirmPassword: {
                equalTo: "The two passwords don't match."
            }
        }

    });

});

function save() {

    var businessData = $('#form2').serializeObject();

    var data = JSON.stringify(businessData);
    $.ajax({
      type: "POST",
      json:true,
      url: '/business/edit',
      'Content-Type': 'application/x-www-form-urlencoded',
      data: {changedValues: data},
      dataType: "json",
      failure: function (err) {
        dataSuccess(err);
      },
      success: function (result) {
          if(result.status == 200 && result.success == true){
              dataSuccess("Business information saved succesfully.");
          }

      }
    });
}
