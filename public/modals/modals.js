    /* events */
$(document).ready(function () {
	$("#navLogIn").click(function() {
		$("#logInModal").modal();
	});
    $("#navSignUp").click(function() {
		$("#signUpModal").modal();
	});


	$("#Register").click(function () {

       register();


	});

    $("#Login").click(function () {
		login();
	});

    $("#navLoginForm input").click(function (){
        $("#LoginUserNotValidated").addClass("hidden");
    });

    /* validations */
    $("#navLoginForm").validate({
        rules: {
            // simple rule, converted to {required:true}
            loginPwd: {
                required: true,
            },
            loginEmail: {
                required: true
            }
        }

    });

    $("#navRegisterForm").validate({
        rules: {
            // simple rule, converted to {required:true}
            registerUsername: {
                required: true,
                usernameExists: true
            },
            registerEmail: {
                required: true,
                email:true,
                emailExists: true
            },
            registerPwd: {
                required: true,
                min: 6
            },
            registerPwdConfirm: {
                required: true,
                equalTo: "#registerPwd",
                min: 6
            }
        },
        messages: {
            registerPwdConfirm: {
                equalTo: "The two passwords don't match."
            }
        }

    });
});


/* extra validation methods */
//we make sure the email isn't taken
$.validator.addMethod("emailExists", function (value, element) {
    var result;
    $.ajax({
         type:'POST',
        async: false,
         url:'/users/emailexists',
         contentType: "application/json; charset=utf-8",
        dataType: 'json',
         data: JSON.stringify({email: $("#registerEmail").val()}),
         success:function(data){
            result = !data; //the server will return true if the email already exists, therefore the validation must return false
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
         }
    });
    return result;
}, "This email is already taken.");

//we make sure user the username isn't taken
$.validator.addMethod("usernameExists", function (value, element) {
    var result;
    $.ajax({
         type:'POST',
        async: false,
         url:'/users/usernameexists',
         contentType: "application/json; charset=utf-8",
        dataType: 'json',
         data: JSON.stringify({username: $("#registerUsername").val()}),
         success:function(data){
            result = !data; //the server will return true if the email already exists, therefore the validation must return false
         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
         }
    });
    return result;
}, "This username is already taken.");


/* functions*/
function login() {

     $("#navLoginForm").validate();
    if (!$("#navLoginForm").valid()) {return;}

    $.ajax({
         type:'POST',
         url:'/login',
         contentType: "application/json; charset=utf-8",
        dataType: 'json',
         data: JSON.stringify({email: $("#loginEmail").val(), password: $('#loginPwd').val()}),
         success:function(result){
            if(result.status == 200) {
                if (result.success == true){
            	   window.location = "/users";
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

function register() {

     $("#navRegisterForm").validate();
    if (!$("#navRegisterForm").valid()) {return;}

    $.ajax({
         type:'POST',
         url:'/signup',
         contentType: "application/json; charset=utf-8",
        dataType: 'json',
         data: JSON.stringify({email: $("#registerEmail").val(), password: $('#registerPwd').val(), username: $('#registerUsername').val()}),
         success:function(result){
            if(result.status == 200){
            	window.location = "/users"
       		 }

         },
         error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
         }
      });

}
