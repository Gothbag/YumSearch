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
                  clickableLabels:false,
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
                data:JSON.stringify({search:$("#MainSearch").val(),maxDistance:$("#maxDistance").val()}),
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

        this.enlargeMap = function (offer) {
            if(typeof enlargedMap =="undefined") return;
            //we create the map before showing the model
            var latLong = new google.maps.LatLng(offer.loc[1], offer.loc[0]),
            mark = new google.maps.Marker({
                position: latLong,
                map: enlargedMap
            });
            $("#mapModalHeader").text(offer.business.name + ", "+ offer.business.address.address +". " + offer.name + ". Price before: " + offer.priceBefore + ", price NOW: " + offer.priceNow);
            /* this is so the map rerendered after the modal is activated*/
            $("#mapModal").modal();
            setTimeout( function(){resizingMap();} , 400);

            function resizingMap() {
               if(typeof enlargedMap =="undefined") return;
               google.maps.event.trigger(enlargedMap, "resize");
                enlargedMap.setCenter(latLong);
            }

        }

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

