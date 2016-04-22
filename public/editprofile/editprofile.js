$(document).ready(function () {


});

/* index Knockout*/
(function () {

	//the main view model
	var ProfileModel = function (user) {
		var self = this;

        this.user = new User(user);

		this.saveUser = function () {
			$.ajax({
		        type: "POST",
		        url: '/api/users/self', /* url of the request */
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

	//represent a single user item
	var User = function (user) {
		this._id = user._id;
        this.firstName = ko.observable(user.firstName);
        this.lastName = ko.observable(user.lastName);
		this.local.username = ko.observable(user.local.name);
        this.local.password = ko.observable();
	}

	var profileModel = new ProfileModel();
	ko.applyBindings(profileModel);

}());
