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
			var data = ko.toJSON(this.users);
			$.ajax({
		        type: "POST",
		        url: '/admin/users/save', /* url of the request */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		  		data: data,
		        success: function (result) {
		            if(result.status == 200 && result.success == true){
                        self.loadUsers();
                    }
		        }
		    });
		}.bind(this);

		this.users = ko.observableArray();
		this.loadUsers();

	};

	//represent a single offer item
	var User = function (user) {
        var self = this;
		this._id = user._id;
        this.firstName = ko.observable(user.firstName);
		this.lastName = ko.observable(user.lastName);
		this.username = ko.observable(user.local.username);
		this.deleteItem = ko.observable(false);
        this.visible = ko.observable(true);
	}
	//we load the data

	var viewModel = new ViewModel();
	ko.applyBindings(viewModel, document.getElementById("users"));

}());
