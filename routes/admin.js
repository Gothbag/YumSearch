module.exports = function (app, passport) {

	/* GET webmaster dasboard */
    app.get('/adminDash', isWebmaster, function(req, res, next) {
        res.render('pages/admin/admin.ejs', { title: 'Webmaster', user: req.user });
	});

    /*obtain offers created by a business*/
    app.post('/offers/business', function (req, res) {
        var query = req.body.search.trim().replace(/\s{1,}/, ".*"); //we obtain the query from the request body
        listUsers(req, res, query, function (users) {
            res.json(users);
        });

    });

     /*save the users*/
    app.post('/admin/users/save', function(req, res) {
        var users = req.body;
        var itemsProcessed = 0; //this is so that when all items are processed, we can send them back
        var len = users.length;
         for (var i = 0; i < len; i++) {
            var user = users[i]; //this way it's easier to work

            if (!user.deleteItem) { //we add/update the users that are not marked for deletion
                delete( user.deleteItem ); //we don't need these fields anymore
                delete( user.visible );
                 User.update({_id:user._id}, offer, {upsert:true, setDefaultsOnInsert: true}, function(err){
                    if (err) {throw err;}
                    itemsProcessed++;
                    if(itemsProcessed === len) {
                        listUsers(req, res, "", function (users) {

                        }); //we return the updated snakes
                    }
                });

            } else { //items marked for deletion
                Offer.remove({_id: offer._id}, function (err) {
                        if (err) {throw err;}
                        itemsProcessed++;
                        if(itemsProcessed === len) {
                            return listUsers(req, res);
                        }
                    });
            }

        }

	});
}

//function to verify the user is logged in
var isWebmaster = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated() && req.user.webmaster == true) { return next();}
	//if the user is not authenticated then we redirect them to the main page
	res.redirect('/');

};

var listUsers = function(req, res, query, callback) {
    User.aggregate([
        {$project:{fullName:{$concat:["$firstName","$lastName"]}}},
        {$match:{$or:[{"local.username": {$regex:query, $options : 'i' }}, {"lastName": {$regex:query, $options : 'i' }} ]}},
        function (err, users) {
            if (err) { throw err; }
            callback(users);
        }
    ]);
}
