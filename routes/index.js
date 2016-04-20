module.exports = function (app, passport) {

	/* GET home page. */
	app.get('/', function(req, res, next) {
	  res.render('pages/main/index.ejs', { title: 'Home', user: req.user });
	});

	/* GET users listing. */
	app.get('/users',isAuthenticated, function(req, res, next) {
	  res.send('respond with a resource');
	});


};

//function to verify the user is logged in
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) { return next();}
	//if the user is not authenticated then we redirect them to the main page
	res.redirect('/');

}
