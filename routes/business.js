var request = require('request');
var Offer = require('../models/offer');
var Business = require('../models/business');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

var shared = require('../config/shared');

module.exports = function (app, passport) {

	/* GET home business page. */
	app.get('/business', function(req, res, next) {
        res.render('pages/business/businessMain.ejs', { title: 'Business', user: req.user, business: true });
	});

    /*GET dashboard business user*/
    app.get('/business/dashboard',isBusiness, function(req, res, next) {
        res.render('pages/business/dashboard.ejs', { title: 'Dashboard', user: req.user });
	});

    /*handling offers page*/
    app.get('/business/offers', isBusiness, function(req, res, next) {
        res.render('pages/business/offers.ejs', { title: 'Offers', user: req.user });
	});

    /*handling business registration page*/
    app.get('/business/register', isNotBusiness, function(req, res, next) {
        res.render('pages/business/businessRegister.ejs', { title: 'Register Business', user: req.user });
	});

    /*handling business registration POST request*/
    app.post('/business/register', function(req, res) {
        var business = req.body.newBusiness;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?components=country:" + business.country + "|postal_code:" + business.postalCode + "&address=" + business.address + ",+" + business.city + "&key=YOUR_API_KEY";
        request({
            url: url,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                var newBusiness = new Business(business);
                //we obtain coordinates of the location
                newBusiness.loc.lat = body.results[0].geometry.location.lat;
                newBusiness.loc.lng = body.results[0].geometry.location.lng;
                newBusiness.address = {};
                newBusiness.address.address = business.address;
                newBusiness.address.city = business.city;
                newBusiness.address.postCode = business.postalCode;
                newBusiness.address.country = business.country;
                newBusiness.creationDate = new Date();

                newBusiness.save(function (err, business) {
                    if (err) { return done(err); }
                    User.update({_id:req.user._id}, {$set:{businesses: business._id}}, function (err) {


                    });
                });
            }
        });


	});

     /*obtain offers created by a business*/
    app.post('/offers/business', listOffers);

     /*save the offers*/
    app.post('/offers/business/save', function(req, res) {
        var itemsProcessed = 0; //this is so that when all items are processed, we can send them back
        var offers = req.body;
        var len = offers.length;
        for (var i = 0; i < len; i++) {
            var offer = offers[i]; //this way it's easier to work
            var id;
            if (offer.hasOwnProperty("_id")) {
                id = new mongo.ObjectId(offer._id); //Knockout sends items without an ObjectId
                delete (offer._id); //we remove the id
            }
            if (!offer.deleteItem) { //we add/update the snakes that are not marked for deletion
                delete( offer.deleteItem ); //we don't need these fields anymore
                delete( offer.visible );
                Offer.findOneAndUpdate({_id:id}, offer, {upsert:true}, function(err, doc){
                    if (err) {throw err;}
                    itemsProcessed++;
                    if(itemsProcessed === len) {
                        return listOffers(req, res); //we return the updated snakes
                    }
                });
            } else { //items marked for deletion
                Offer.remove({_id: id}, function (err) {
                        if (err) {throw err;}
                        itemsProcessed++;
                        if(itemsProcessed === len) {
                            return listOffers(req, res);
                        }
                    });
            }

        }
	});
};

var listOffers = function(req, res) {
    Offer.find({business:req.user.businesses}, function (err, offers) {
        if (err) { throw err; }
        res.json(offers);
    });
}

//function to verify whether a user has a business account
var isBusiness = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated() && req.user.businesses != undefined && req.user.businesses != null) { return next();}
	//if the user is not authenticated then we redirect them to the main page
	res.redirect('/');

};

//function to make a sure a user DOESN'T have a business account
var isNotBusiness = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated() && (req.user.businesses == undefined || req.user.businesses == null)) { return next();}
	//if the user is not authenticated then we redirect them to the main page
	res.redirect('/');

};
