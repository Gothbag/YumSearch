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

    app.post('/login', function (req, res, next) {
		passport.authenticate('local-login', function (err, user) {

			if (err) { return next(err); }
		    if (!user) { return res.json({success:false, "status" : 200}); }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
             res.json({"success" :true, "status" : 200});
            });
		})(req, res, next);

	});


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

