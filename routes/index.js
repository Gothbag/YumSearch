module.exports = function (app, passport) {

	/* GET home page. */
	app.get('/', function(req, res, next) {
	  res.render('pages/main/index.ejs', { title: 'Home' });
	});

	/* GET users listing. */
	app.get('/users', function(req, res, next) {
	  res.send('respond with a resource');
	});


};
