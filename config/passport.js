var LocalStrategy = require('passport-local').Strategy;
//User model
var User = require('../models/user');

module.exports = function (passport) {
	//users must be serialized for the session by Passport
	passport.serializeUser(function (user, done) {
		done(null, user.id); //callback
	});
	//the user is deserialized
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			if (user) {
				done(err, user); //err should be null
			}
		});
	});
	passport.use('local-signup', new LocalStrategy({
		passReqToCallback: true, //the request is passed to the callback function
		usernameField: "email" //we use the email to log in	
	}, function (req, email, password, done) {
		var username = req.body.username;
		process.nextTick(function () {
			User.findOne({ $or: [ { 'local.username': username }, { 'local.email': email } ] }, function (err, user) {
				if (err) {return done(err);}
				if (user) {
					return done(null, false);
				} else {
					var newUser = new User();
                    //the new user is set
					newUser.local.username = username;
					newUser.local.email = email;
                    newUser.creationDate = new Date();
					newUser.local.password = newUser.generateHash(password); //password is hashed

					newUser.save(function (err) {	
						if (err) { return done(err); }
						return done(null, newUser);
					});
				}
			});
		});
	}));
    //login
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, email, password, done) {
        //find a user whose mail or username matches the login used on the form
        //we check if the user already exists
        User.findOne({ $or: [ { 'local.username': email }, { 'local.email': email } ] }, function (err, user) {
            if (err) {return done(err);}
            // if no user is found, return the message
            if (!user) {return done(null, false);}

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {return done(null, false);}

            // all is well, return successful user
            return done(null, user);
        });
    }));
}
