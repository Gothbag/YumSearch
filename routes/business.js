var Offer = require('../models/offer');

module.exports = function (app, passport) {

	/* GET home business page. */
	app.get('/business', function(req, res, next) {
        res.render('pages/business/businessMain.ejs', { title: 'Business', user: req.user, business: true });
	});

    /*GET dashboard business user*/
    app.get('/dashboard', function(req, res, next) {
        res.render('pages/business/dashboard.ejs', { title: 'Dashboard', user: req.user });
	});

    /*handling offers page*/
    app.get('/dashboard/offers', function(req, res, next) {
        res.render('pages/business/offers.ejs', { title: 'Offers', user: req.user });
	});

    /*handling business registration page*/
    app.get('/business/register', function(req, res, next) {
        res.render('pages/business/businessRegister.ejs', { title: 'Register Business', user: req.user });
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
