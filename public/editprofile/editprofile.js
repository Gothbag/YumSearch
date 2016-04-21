/* index Knockout*/
(function () {

	//the main view model
	var ProfileModel = function () {
		var self = this;

        this.user = this;

		this.offers = [];
		//OJO!! temporary
		pOffers.map(function (offer) {
			self.offers.push(new Offer(offer));
		});

		this.loadUser = function () {
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
		this._id = snake._id;
		this.local.name = ko.observable(user.local.name);
		this.local.password = ko.observable(user.local.password);
		this.age = ko.observable(snake.age);
	}

	var profileModel = new ProfileModel();
	ko.applyBindings(profileModel);

}());
