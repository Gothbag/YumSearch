/* events */
$(document).ready(function () {

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
