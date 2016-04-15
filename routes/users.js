var express = require('express');
var router = express.Router();

module.exports = function (passport) {

	/* GET users listing. */
	router.get('/users', function(req, res, next) {
	  res.send('respond with a resource');
	});

	return router;

};