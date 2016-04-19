module.exports = function (app, passport) {
	/* GET users listing. */
	app.get('/users', function(req, res, next) {
	  res.send('respond with a resource');
	});

	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (req, res, next) {
			if (err) { return next(err); }
		    if (!user) { return res.json({success:false}); }
	    	return res.json({success: true});
		})(req, res, next);

	});
};

