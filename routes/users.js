module.exports = function (app, passport) {

<<<<<<< HEAD
	
	
=======
	/* GET users listing. */
	app.get('/users', function(req, res, next) {
	  res.send('respond with a resource');
	});

>>>>>>> 53f553effc4c7c528e326e3343e93124d97aac3f
	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (req, res, next) {
			if (err) { return next(err); }
		    if (!user) { return res.json({success:false}); }
	    	return res.json({success: true});
		})(req, res, next);

	});
<<<<<<< HEAD

};
=======
};
>>>>>>> 53f553effc4c7c528e326e3343e93124d97aac3f
