module.exports = function (app, passport) {

	/* GET webmaster dasboard */
    app.get('/adminDash', isWebmaster, function(req, res, next) {
        res.render('pages/admin/admin.ejs', { title: 'Webmaster', user: req.user });
	});
}

//function to verify the user is logged in
var isWebmaster = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated() && req.user.webmaster == true) { return next();}
	//if the user is not authenticated then we redirect them to the main page
	res.redirect('/');

};
