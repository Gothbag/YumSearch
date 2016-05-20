var enlargedMap;
$(document).ready(function () {

    /*$('#mapModal').on('show.bs.modal', function() {
       //Must wait until the modal shows, that's why we require a callback funtion
       resizeMap();
    });*/

    if ($("#LargeMap").length > 0) { //this is so the script doesn't cause an exception if the selector cannot be found
        //the map center is in Barcelona
        var barcelona = new google.maps.LatLng(41.3833, 2.1833);
        function initialize() {
            var mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: barcelona
            };
            enlargedMap = new google.maps.Map(document.getElementById("LargeMap"), mapOptions);

        }
        google.maps.event.addDomListener(window, "load", initialize);
    }

    //we update the search placeholder text
    $("#maxDistance").change(function () {

        $("#MainSearch").attr("placeholder", "Search for food products " + $("#maxDistance").val() + " km away from you.");

    });
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

    ko.bindingHandlers.offerMap = {
        init: function (element, valueAccessor) {
            var
            offer = valueAccessor(),
                latLng = new google.maps.LatLng(offer.loc[1], offer.loc[0]),
                mapOptions = {
                    center: latLng,
                    zoom: 14,
                    disableDefaultUI: true,
                    scrollwheel: false,
                    navigationControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    draggable: false,
                    styles: [
                        {
                            "featureType": "poi",
                            "stylers": [
                                { "visibility": "off" }
                            ]
                        }
                    ],
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                },
                map = new google.maps.Map(element, mapOptions),
                marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                }),
                offerInfoDiv = document.createElement('div'),
                offerInfo = new OfferInfo(offerInfoDiv, map, offer);
            //adding the control onto the map
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(offerInfoDiv);
        }
    };

    //the main view model
    var ViewModel = function () {
        var self = this;

        var limit = true;

        this.businesses = [];

        this.loadBusinesses = function () {
            $.ajax({
                type: "POST",
                url: '/business/search', /* url of the request */
                data:JSON.stringify({search:$("#MainSearch").val()}),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (data) {
                    self.offers.removeAll(); //all offers are removed beforehand
                    data.map(function (offer) {
                        limit = false;
                        self.offers.push(new Offer(offer));
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
    this.address = business.address;
    this.avgRating = business.avgRating;
    this.name = business.name;
}


