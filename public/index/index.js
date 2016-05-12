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
            }),
            offerInfoDiv = document.createElement('div'),
            offerInfo = new OfferInfo(offerInfoDiv, map, offer);
            //open window on click
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
            //adding the control the map
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(offerInfoDiv);
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
                data:JSON.stringify({search:$("#MainSearch").val()}),
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

		this.offers = ko.observableArray();
		this.loadOffers();

	};

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);

}());

var Offer = function (offer) {
    var self = this;
    this.loc = offer.loc;
    this.name = offer.name;
    this.priceNow = offer.priceNow;
    this.priceBefore = offer.priceBefore;
    this.business = offer.business;
}
//this is a class for a "home control" that returns the user to Barcelona when clicked
function OfferInfo(pControlDiv, pMap, pOffer) {
    pControlDiv.style.padding = '5px';
    var controlUI = document.createElement('div');
    //properties of the DOM element
    controlUI.style.textAlign = 'center';
    controlUI.style.backgroundColor = 'white';
    pControlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    //properties of the text
    controlText.style.fontFamily = 'Arial, sans-serif';
    controlText.style.fontSize = '15px';
    controlText.style.fontWeight = '600';
    controlText.padding = '2px';
    controlText.innerHTML = pOffer.business.name + ". " + pOffer.name + ". Price before: " + pOffer.priceBefore + ", price NOW: " + pOffer.priceNow;
    controlUI.appendChild(controlText);
}
