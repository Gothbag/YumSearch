module.exports = function (app, passport) {
	/* GET users listing. */
	app.get('/users', function(req, res, next) {
	  res.send('respond with a resource');
	});

	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (err, user) {

			if (err) { return next(err); }
		    if (!user) { return res.json({success:false}); }
	    	res.send('{"success" : "Updated Successfully", "status" : 200}');
		})(req, res, next);

	});

};

