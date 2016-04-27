module.exports = function (app, passport) {

	/* GET home business page. */
	app.get('/admin', function(req, res, next) {
        res.render('pages/admin/adminAuth.ejs', { title: 'Webmaster', user: req.user });
	});
}
