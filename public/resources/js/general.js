/* events */
$(document).ready(function () {
    $("#terms_cond").click(function() {
        $("#t_and_c_m").modal();
    });

    /* function to validate names with non-ASCII characters*/
    $.validator.addMethod("LatinNames", function (value, element) {
        return (/^[a-z\u00E0-\u00FC\s-]+$/i.test(value));
    }, "Incorrect format");

    $.validator.addMethod("skip_or_fill_minimum", function(value, element, options) {
        var elems = $(element).parents('form').find(options[1]);
        var numberFilled = elems.filter(':filled').size();
        if (numberFilled >= options[0] || numberFilled == 0) {
            elems.removeClass('error');
            elems.next('label.error').not('.checked').text('').addClass('checked');
            return true;
        } else {
            elems.addClass('error');
        }
    }, $.format("Please either skip these fields or fill at least {0} of them."));

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

//this a new method to JQuery to serialize an object
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

