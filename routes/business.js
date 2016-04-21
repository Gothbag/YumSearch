module.exports = function (app, passport) {

	/* GET home business page. */
	app.get('/business', function(req, res, next) {
        res.render('pages/business/businessMain.ejs', { title: 'Business', user: req.user });
	});

    /*GET dashboard business user*/
    app.get('/dashboard', function(req, res, next) {
        res.render('pages/business/dashboard.ejs', { title: 'Dashboard', user: req.user });
	});
};
