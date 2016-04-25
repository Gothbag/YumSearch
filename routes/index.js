module.exports = function (app, passport) {

	/* GET home page. */
	app.get('/', function(req, res, next) {
	  res.render('pages/main/index.ejs', { title: 'Home', user: req.user });
	});

};

