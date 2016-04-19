/* events */
$(document).ready(function () {
	$("#navLogIn").click(function() {
		$("#logInModal").modal();
	});
    $("#navSignUp").click(function() {
		$("#signUpModal").modal();
	});
    $("#terms_cond").click(function() {
		$("#termsModal").modal();
	});

	$("#Register").click(function () {
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
	});
});

/* index Knockout*/
(function () {

	//the main view model
	var ViewModel = function (pOffers) {
		var self = this;

		this.offers = [];
		//OJO!! temporary
		pOffers.map(function (offer) {
			self.offers.push(new Offer(offer));
		});

		this.loadOffers = function () {
			$.ajax({
		        type: "POST",
		        url: '/api/offers/nearby', /* url of the request */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		        success: function (data) {
		        	self.offers.removeAll(); //all snakes are removed beforehand
					data.map(function (offer) {
						self.offers.push(new Offer(offer));
					});
		        }
		    });
		}.bind(this);

		//this.offers = ko.observableArray();
		//this.loadSnakes();

	};

	//represent a single snake item le
	var Offer = function (offer) {
		this._id = offer._id;
		this.now = offer.now;
		this.before = offer.before;
		this.imgSrc = offer.imgSrc;
		this.prod = offer.prod;
	}
	//we load the data

	var offers = [{before:2.5,now:2,imgSrc:"tomatoes.jpg",prod:"Tomatoes"},{before:2.5,now:2,imgSrc:"tomatoes.jpg",prod:"Strawberries"},{before:2.5,now:2,imgSrc:"tomatoes.jpg",prod:"Fish"}]

	var viewModel = new ViewModel(offers);
	ko.applyBindings(viewModel);

}());
