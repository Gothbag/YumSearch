var Offer = require('../models/offer');
var Business = require('../models/business');
var ObjectId = require('mongoose').Types.ObjectId;
var maxmind = require('maxmind');

module.exports = function (app) {


     /*obtain offers created by a business*/
    app.post('/offers/business', listOffers);

     /*save the offers*/
    app.post('/offers/business/save', function(req, res) {
        var offers = req.body;
        Business.findOne({_id:req.user.businesses}, function (err, business) {
            if (err) {throw err;}
            if (!business) {res.json({err:"business could not be found"})}
            var itemsProcessed = 0; //this is so that when all items are processed, we can send them back
            var len = offers.length;
             for (var i = 0; i < len; i++) {
                var offer = offers[i]; //this way it's easier to work

                if (!offer.deleteItem) { //we add/update the snakes that are not marked for deletion
                    delete( offer.deleteItem ); //we don't need these fields anymore
                    delete( offer.visible );
                    delete( offer.differencePercentage );
                    offer.loc = business.loc;
                    if (!offer.hasOwnProperty("business")) { offer.business = business._id;}
                    if (!offer.hasOwnProperty("_id")) { offer._id = new ObjectId();} //the update method doesn't add an _id property
                     Offer.update({_id:offer._id}, offer, {upsert:true, setDefaultsOnInsert: true}, function(err){
                        if (err) {throw err;}
                        itemsProcessed++;
                        if(itemsProcessed === len) {
                            return listOffers(req, res); //we return the updated snakes
                        }
                    });

                } else { //items marked for deletion
                    Offer.remove({_id: offer._id}, function (err) {
                            if (err) {throw err;}
                            itemsProcessed++;
                            if(itemsProcessed === len) {
                                return listOffers(req, res);
                            }
                        });
                }

            }
        });

	});

    /*get nearby offers*/
    app.post('/offers/nearby', function(req, res) {
        var query = req.body.search.trim().replace(/\s{1,}/, ".*");
        var maxDistance = Number(req.body.maxDistance);
        var limit = req.body.limit; //this allows us to know if we have to limit the query or not
        var ip = req.ip.replace('::ffff:', ""); //this is a subnet prefix for IPv4 (32 bit) addresses that are placed inside an IPv6 (128 bit) space. we remove it
        var ipUsed = (ip == '127.0.0.1' ? '88.0.22.216' : req.ip);
        maxmind.init('./ipsdb/GeoLiteCity.dat'); //connecting to GeoLite IP database
        var location = maxmind.getLocation(ipUsed); //obtaining the user's geolocation via their IP
        console.log(query);
        var select = Offer.find({name: {$regex:query, $options : 'i' }, loc: {"$near":[location.longitude, location.latitude], "$maxDistance": maxDistance/111.12}}).populate('business');
        if (limit) {
            select = select.limit(3);
        }
        select.exec(function (err, offers) { //one degree is approximately 111.12 kilometers
                if (err) { throw err; }
                res.json(offers);
        }); //the populate function will "populate" the business that corresponds to the location
    });

};

var listOffers = function(req, res) {
    Offer.find({business:req.user.businesses}, function (err, offers) {
        if (err) { throw err; }
        res.json(offers);
    });
}
