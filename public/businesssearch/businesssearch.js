
$(document).ready(function () {

});

/* index Knockout*/

(function () {

    var ENTER_KEY = 13;

    // A factory function we can use to create binding handlers for specific
    // keycodes (which we'll use for the Enter key).
    function keyhandlerBindingFactory(keyCode) {
        return {
            init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                var wrappedHandler, newValueAccessor;

                // wrap the handler with a check for the enter key
                wrappedHandler = function (data, event) {
                    if (event.keyCode === keyCode) {
                        valueAccessor().call(this, data, event);
                    }
                };

                // create a valueAccessor with the options that we would want to pass to the event binding
                newValueAccessor = function () {
                    return {
                        keyup: wrappedHandler
                    };
                };

                // call the real event binding's init function
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    // a custom binding to handle the Enter key
    ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

    //the main view model
    var ViewModel = function () {
        var self = this;

        var limit = true;

        this.businesses = [];

        this.loadBusinesses = function () {
            $.ajax({
                type: "POST",
                url: '/search_businesses', /* url of the request */
                data:JSON.stringify({search:$("#businessSearch").val()}),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (data) {
                    self.businesses.removeAll(); //all offers are removed beforehand
                    data.map(function (business) {
                        limit = false;
                        self.business.push(new Business(business));
                    });
                }
            });
        }.bind(this);

        this.businesses = ko.observableArray();
        this.loadBusinesses();

    };

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);

}());

var Business = function (business) {
    var self = this;
    this.id = business._id;
    this.address = business.address;
    this.avgRating = business.avgRating;
    this.name = business.name;
}


