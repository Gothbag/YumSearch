module.exports = function (app, passport) {

	/* GET home page. */
	app.get('/', function(req, res, next) {
        console.log(req.cookies);
/*        if (req.cookies.hasOwnProperty('remember') && req.user == null) {
            passport.authenticate('local-cookie-login', function (err, user) {
                if (err || !user) { return next(err); }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    res.cookie('remember', user.local.username, { maxAge: 2629746000 });
                });
            })(req, res, next);
        }*/
        res.render('pages/main/index.ejs', { title: 'Home', user: req.user });
	});

    /*GET contact page*/
    app.get('/contact', function(req, res, next) {
        res.render('pages/main/contact.ejs', { title: 'Contact', user: req.user });
	});
};

