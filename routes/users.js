var _ = require('underscore');
//User model
var User = require('../models/user');

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

     app.post('/users/emailexists', function (req, res) {
		User.findOne({ 'local.email': req.body.email }, function (err, user) {
            if (err) { throw err;}
            // a user is found, we return true
            if (user) {return res.send(true);}
            //no users have been found
            return res.send(false);
        });

	});

    app.post('/users/usernameexists', function (req, res) {
		User.findOne({ 'local.username': req.body.username }, function (err, user) {
            if (err) { throw err;}
            // a user is found, we return true
            if (user) {return res.send(true);}
            //no users have been found
            return res.send(false);
        });

	});

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/editprofile', isAuthenticated, function(req, res) {
        var userSubset = _.pick(req.user, 'firstName', 'lastName'); //we only pick the properties we need
        userSubset.local = {};
        userSubset.local.username = req.user.local.username;
        console.log(userSubset);
        res.render('pages/users/editprofile.ejs', { title: 'Edit profile', user: userSubset });
    });

    /* GET users listing. */
	app.get('/users',isAuthenticated, function(req, res, next) {
	  res.send('respond with a resource');
	});

    /* new user welcome page */
	app.get('/usercreated',isAuthenticated, function(req, res, next) {
	  res.render('pages/users/usercreated.ejs', { title: 'User created successfully', user: req.user });
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


