var express = require('express');
var router = express.Router();

module.exports = function (passport) {

	/* GET users listing. */
	router.get('/users', function(req, res, next) {
	  res.send('respond with a resource');
	});

	router.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (req, res, next) {
			if (err) { return next(err); }
		    if (!user) { return res.json({success:false}); }
	    	return res.json({success: true});
		})(req, res, next);

	});

	return router;

};