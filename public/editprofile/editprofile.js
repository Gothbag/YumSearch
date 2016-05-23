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
            email: {
                required: true,
                email: true
            },
            firstName: {
                LatinNames: true
            },
            lastName: {
                LatinNames: true
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

    var userData = $('#form2').serializeObject();
    delete userData.confirmPassword;

    var data = JSON.stringify(userData);
    $.ajax({
      type: "POST",
      json:true,
      url: '/users/updateuser',
      'Content-Type': 'application/x-www-form-urlencoded',
      data: {changedValues: data},
      dataType: "json",
      failure: function (err) {
            dataSuccess(err);
        },
        success: function (result) {
        if (result.status == 200 && result.success == true){
                dataSuccess("Details saved succesfully.");
          }

      }
    });
}
