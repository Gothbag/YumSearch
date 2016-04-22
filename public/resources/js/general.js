/* events */
$(document).ready(function () {
    $("#terms_cond").click(function() {
		$("#t_and_c_m").modal();
	});


});

// override jquery validate plugin defaults
$.validator.setDefaults({
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});
/* function to validate names with non-ASCII characters*/
$.validator.addMethod("LatinNames", function (value, element) {
   return (/^[a-z\u00E0-\u00FC\s-]+$/i.test(value));
}, "Incorrect format");
