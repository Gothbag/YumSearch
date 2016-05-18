var Rating = require('../models/rating');
var Business = require('../models/business');
var ObjectId = require('mongoose').Types.ObjectId;
var shared = require('../config/shared');

module.exports = function (app) {

    app.get('/user/ratings/postRating', shared.isAuthenticated, function(req, res) {
        res.render('pages/users/postRating.ejs', { title: 'Personal', user: req.user });
    });

    app.post('/user/post_rating', shared.isAuthenticated, function(req, res) {

        var newRating = new Rating();
        newRating.comment = req.body.message;
        newRating.score = req.body.rating;
        newRating.from = req.user._id;

        console.log (req.body.message);
        console.log (req.body.rating);
        console.log (req.user._id);
        console.log (req.body.search_businessName);

        Business.findOne({'name': req.body.search_businessName }, function (err, business) {
            if (err) {return done(err);}
            if (business) {
                newRating.to = business._id;
                console.log ("paso por aqui");
                newRating.save(function (err) {
                    if (err) { return done(err); }
                    res.redirect('/users/personal');
                });
            }
        });

    });

}
