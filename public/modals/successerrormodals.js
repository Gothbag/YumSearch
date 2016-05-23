function dataSuccess(message) {

    $('#successErrorModalContent').html(
        '<div class="alert alert-success ">' + message + '<button type="button" class="close" data-dismiss="modal">&times;</button></div>');
    $("#successErrorModal").modal();

}

function dataError (message) {
    $('#successErrorModalContent').html(
        '<div class="alert alert-danger ">' + message + '<button type="button" class="close" data-dismiss="modal">&times;</button></div>');
    $("#successErrorModal").modal();
}

$(document).ready(function () {

    $(".CloseSuccessErrorModal").click(function () {
        $('#successErrorModal').modal('hide');
    });

});
