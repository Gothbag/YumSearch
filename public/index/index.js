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
					data.map(function (offer) {
						self.offers.push(new Offer(offer));
					});
		        }
		    });
		}.bind(this);

		this.offers = ko.observableArray();
		this.loadOffers();

	};

	//represent a single snake item le
	var Offer = function (offer) {
		this._id = offer._id;
		this.priceNow = offer.priceNow;
		this.priceBefore = offer.priceBefore;
		this.imgSrc = offer.imgSrc;
		this.name = offer.name;
	}
	//we load the data

	//var offers = [{before:2.5,now:2,imgSrc:"tomatoes.jpg",prod:"Tomatoes"},{before:2.5,now:2,imgSrc:"tomatoes.jpg",prod:"Strawberries"},{before:2.5,now:2,imgSrc:"tomatoes.jpg",prod:"Fish"}]

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

    var bcnInfoWindow = new google.maps.InfoWindow({
        content: "<div style=\"background-color: pink\">Welcome to Barcelona! We love pink here!</div>"
    });
    //open window on click
    google.maps.event.addListener(marker, 'click', function () {
        bcnInfoWindow.open(map, marker);
    });
*/
