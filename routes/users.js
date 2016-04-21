module.exports = function (app, passport) {

	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (err, user) {

			if (err) { return next(err); }
		    if (!user) { return res.json({success:false}); }
	    	req.logIn(user, function(err) {
              if (err) { return next(err); }
             res.json({"success" :true, "status" : 200});
            });
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

    app.get('/editprofile', isAuthenticated, function(req, res) {
        res.render('pages/users/editprofile.ejs', { title: 'Edit profile', user: req.user });
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

};


