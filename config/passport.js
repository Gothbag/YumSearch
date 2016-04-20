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
		})
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

					newUser.local.username = username;
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function (err) {	
						if (err) { return done(err); }
						return done(null, newUser);
					});
				}
			});
		});
	}));
}