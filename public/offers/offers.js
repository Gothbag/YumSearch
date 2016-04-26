/* events */
$(document).ready(function () {

});

/* offers page Knockout*/
(function () {

	//the main view model
	var ViewModel = function (offers) {
		var self = this;

		this.loadOffers = function () {
			$.ajax({
		        type: "POST",
		        url: '/offers/business', /* url of the request */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		        success: function (data) {
		        	self.offers.removeAll(); //all offers are removed beforehand
					data.map(function (offer) {
						self.offers.push(new Offer(offer));
					});
		        }
		    });
		}.bind(this);

		//store the new offer being added
		this.current = ko.observable();
		//add a new offer
		this.add = function () {
			this.offers.push(new Offer({name:"Product"}));
		}.bind(this); // this ensures the value "this" is the parent object and not the array item.

		this.remove = function (offer) {
			if (offer.hasOwnProperty("_id")) {
				offer.visible(false); //we hide the offer
				offer.deleteItem(true); //we mark if for deletion
			} else {
				this.remove(offer); //the offer is just removed from the array
			}
		}.bind(this);

		this.save = function () {
			var data = ko.toJSON(this.offers);
			$.ajax({
		        type: "POST",
		        url: '/offers/business/save', /* url of the request */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		  		data: data,
		        success: function (data) {
		            self.offers.removeAll();
		            data.map(function (offer) {
						self.offers.push(new Offer(offer));
					});
		        }
		    });
		}.bind(this);

		this.offers = ko.observableArray();
		this.loadOffers();

	};

	//represent a single offer item
	var Offer = function (offer) {
		this._id = offer._id;
		this.visible = ko.observable(true);
		this.deleteItem = ko.observable(false);
		this.name = ko.observable(offer.name);
		this.priceNow = ko.observable(offer.priceNow);
        this.priceBefore = ko.observable(offer.priceBefore);
		this.business = offer.business;
	}
	//we load the data

	var viewModel = new ViewModel();
	ko.applyBindings(viewModel, document.getElementById("offers"));

}());
