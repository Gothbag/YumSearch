module.exports = function (app, passport) {

	/* GET home page. */
	app.get('/', function(req, res, next) {
	  res.render('pages/main/index.ejs', { title: 'Home', user: req.user });
	});

    /*GET contact page*/
    app.get('/contact', function(req, res, next) {
        res.render('pages/main/contact.ejs', { title: 'Contact', user: req.user });
	});
};

