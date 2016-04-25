$(document).ready(function () {

    if (!FileReader) {

        $("#uploadedavatar").addClass("hidden");

    }

    $("#avatarupload").change(function (evt) {

         var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                $("#uploadedavatar").attr("src", fr.result); //the image is uploaded
            }
            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
        }

    });



});
