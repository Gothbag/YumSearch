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

        this.offers = [];

        this.loadOffers = function () {
            $.ajax({
                type: "POST",
                url: '/offers/nearby', /* url of the request */
                data:JSON.stringify({search:$("#MainSearch").val(),maxDistance:$("#maxDistance").val(), limit:limit}),
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

        this.enlargeMap = function (offer) {
            if(typeof enlargedMap =="undefined") return;
            //we create the map before showing the model
            var latLong = new google.maps.LatLng(offer.loc[1], offer.loc[0]),
                infoWindow = new google.maps.InfoWindow({
                    content: "<div>" + offer.business.address.address + "</div>"
                }),
                mark = new google.maps.Marker({
                    position: latLong,
                    map: enlargedMap
                });
                //open window on click
                google.maps.event.addListener(mark, 'click', function () {
                    infoWindow.open(enlargedMap, mark);
                });
            $("#mapModalHeader").empty();
            $("#mapModalHeader").append("<h4>" + offer.business.name + ", " + offer.business.address.address + "</h4>");
            $("#mapModalHeader").append("<h4><span style='text-transform: uppercase;'>" + offer.name + "</span>" + " <span style='color: red;'>&nbsp;&nbsp;&nbsp; Price before: " + offer.priceBefore + "</span> <span style='color: green;'>&nbsp;&nbsp;&nbsp;Price NOW: " + offer.priceNow +" </span> <a href='/business/profile/" + offer.business.id + "'><button type='button' class='btn btn-labeled btn-info'><span class='btn-info'><i class='fa fa-star-o'></i></span>See ratings</button></a></h4>");

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
    controlUI.style.backgroundColor = '#5bc0de';
    controlUI.style.color = 'white';
    pControlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');

    var businessDiv = document.createElement('div');
    businessDiv.style.fontFamily = "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif";
    businessDiv.style.fontSize = '15px';
    businessDiv.style.fontWeight = 'bold';
    businessDiv.innerHTML = pOffer.business.name;


    var offerDiv = document.createElement('div');
    offerDiv.style.fontFamily = "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif";
    offerDiv.style.fontSize = '20px';
    offerDiv.style.textTransform = 'uppercase';
    offerDiv.innerHTML = pOffer.name;

    var priceBefore = document.createElement('div');
    priceBefore.style.fontFamily = "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif";
    priceBefore.style.fontSize = '15px';
    priceBefore.innerHTML = "Price before: " + pOffer.priceBefore;

    var priceNow = document.createElement('div');
    priceNow.style.fontFamily = "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif";
    priceNow.style.fontSize = '15px';
    priceNow.innerHTML = "Price NOW: " + pOffer.priceNow;

    controlText.appendChild(businessDiv);
    controlText.appendChild(offerDiv);
    controlText.appendChild(priceBefore);
    controlText.appendChild(priceNow);

    controlUI.appendChild(controlText);
}



















