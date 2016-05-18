/* events */
$(document).ready(function () {

    /* validations */
    $("#form2").validate({


    });
    /*validation classes*/
    jQuery.validator.addClassRules("Number", {
      number: true
    });


});

/* offers page Knockout*/
(function () {

	//the main view model
	var ViewModel = function (offers) {
		var self = this;

		this.loadUsers = function () {
			$.ajax({
		        type: "POST",
		        url: '/admin/users', /* url of the request */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		        success: function (data) {
		        	self.users.removeAll(); //all users are removed beforehand
					data.map(function (user) {
						self.users.push(new Offer(user));
					});
		        }
		    });
		}.bind(this);

		this.remove = function (user) {
			if (user.hasOwnProperty("_id")) {
				user.visible(false); //we hide the user
				user.deleteItem(true); //we mark them for deletion
			} else {
				self.remove(user); //the user is just removed from the array
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
        var self = this;
		this._id = offer._id;
        this.business = offer.business;
		this.visible = ko.observable(true);
		this.deleteItem = ko.observable(false);
		this.name = ko.observable(offer.name);
		this.priceNow = ko.observable(offer.priceNow);
        this.priceBefore = ko.observable(offer.priceBefore);
        this.differencePercentage = ko.computed({
            read: function () {
                var diffPer;
                if (self.priceNow() > 0 && self.priceBefore() > 0) {
                    diffPer = ((self.priceBefore() - self.priceNow()) / self.priceBefore()) * 100;
                } else {
                    diffPer = 0;
                }
                return diffPer;
            },
            write: function (value) {
                if (self.priceBefore() == 0) { return; }
                self.priceNow(self.priceBefore() * (100-value) * 0.01);
            }
        });
		this.business = offer.business;
	}
	//we load the data

	var viewModel = new ViewModel();
	ko.applyBindings(viewModel, document.getElementById("offers"));

}());
