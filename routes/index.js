var express = require('express');
var router = express.Router();

module.exports = function (passport) {

	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('pages/main/index.ejs', { title: 'Home' });
	});

	return router;

};
