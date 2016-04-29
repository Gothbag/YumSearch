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

     /*obtain offers created by business*/
    app.post('/offers/business', function(req, res, next) {
        Offer.find({}, function (err, offers) {
            if (err) { throw err; }
            res.json(offers);
        });
	});
};
