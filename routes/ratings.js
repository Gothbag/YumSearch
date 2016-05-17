var Rating = require('../models/rating');
var Business = require('../models/business');
var ObjectId = require('mongoose').Types.ObjectId;
var shared = require('../config/shared');

module.exports = function (app) {

    app.get('/user/ratings/postRating', shared.isAuthenticated, function(req, res) {
        res.render('pages/users/postRating.ejs', { title: 'Personal', user: req.user });
    });

    app.get('/user/ratings', shared.isAuthenticated, function(req, res) {
        res.send('Load all comments of current user');
    });

    app.post('/user/post_rating', shared.isAuthenticated, function(req, res) {
        var newRating = new Rating();
        newRating.comment = req.body.message;
        newRating.score = req.body.rating;
        newRating.from = req.user._id;

        Business.findOne({ 'name': req.body.search_businessName }, function (err, business) {
            if (err) {return done(err);}
            if (business) {
                newRating.to = business._id;

            }

        });
        /*
        newRating.to = extract "_id" from req.body.search_businessName;
        */

    });

    app.post('/ratings/user', function (req, res) {
        Rating.find({from: req.user._id })
            .populate('from')
            .exec(function (err, ratings) {
                if (err) { throw err; }
                res.json(ratings);
        }); //the populate function will "populate" the businesses that have been rated by the user
    });

}
