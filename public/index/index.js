/* events */
$(document).ready(function () {

});

/* index Knockout*/
(function () {

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
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
              map = new google.maps.Map(element, mapOptions),
              marker = new google.maps.Marker({
                position: latLng,
                map: map
              }),
            infoWindow = new google.maps.InfoWindow({
                content: "<div>" + offer.business.address.address + "</div>"
            });
            //open window on click
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        }
    };

	//the main view model
	var ViewModel = function () {
		var self = this;

		this.offers = [];

		this.loadOffers = function () {
			$.ajax({
		        type: "POST",
		        url: '/offers/nearby', /* url of the request */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		        success: function (data) {
		        	self.offers.removeAll(); //all snakes are removed beforehand
					self.offers = data;
		        }
		    });
		}.bind(this);

		this.offers = ko.observableArray();
		this.loadOffers();

	};

	var viewModel = new ViewModel();
	ko.applyBindings(viewModel);

}());



/*
// create the maps
    var myOptions = {
        zoom: 14,
        center: new google.maps.LatLng(0.0, 0.0),
        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


*/
