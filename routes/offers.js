var Offer = require('../models/offer');
var Business = require('../models/business');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {


     /*obtain offers created by a business*/
    app.post('/offers/business', listOffers);

     /*save the offers*/
    app.post('/offers/business/save', function(req, res) {
        var itemsProcessed = 0; //this is so that when all items are processed, we can send them back
        var offers = req.body;
        var len = offers.length;
        for (var i = 0; i < len; i++) {
            var offer = offers[i]; //this way it's easier to work

            if (!offer.deleteItem) { //we add/update the snakes that are not marked for deletion
                delete( offer.deleteItem ); //we don't need these fields anymore
                delete( offer.visible );
                delete( offer.differencePercentage );
                if (!offer.hasOwnProperty("business")) { offer.business = req.user.businesses;}
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

    /*get nearby offers*/
    app.post('/offers/nearby', function(req, res) {
        Offer
            .find({business:req.user.businesses})
            .populate("business")
            .exec(function (err, offers) {
                if (err) { throw err; }
                res.json(offers);
        });
    });

};

var listOffers = function(req, res) {
    Offer.find({business:req.user.businesses}, function (err, offers) {
        if (err) { throw err; }
        res.json(offers);
    });
}
