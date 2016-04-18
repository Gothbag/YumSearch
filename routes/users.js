module.exports = function (app, passport) {

	
	
	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (req, res, next) {
			if (err) { return next(err); }
		    if (!user) { return res.json({success:false}); }
	    	return res.json({success: true});
		})(req, res, next);

	});

};