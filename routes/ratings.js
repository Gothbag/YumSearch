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

        Business.findOne({name: req.body.search_businessName }, function (err, business) {
            if (err) {throw err;}
            if (business) {
                newRating.to = business._id;
                newRating.save(function (err) {
                    if (err) { return done(err); }
                    res.redirect('/users/personal'); //we obtain the business' average ratings
                    Rating.aggregate([{$match:{to:business._id}},{$group:{_id:null,avgRating:{$avg:"$score"}}}], function (err, result) {
                        if (err) {throw err;}
                        console.log(result);
                         Business.update({_id:business._id}, {$set:{avgRating:result[0].avgRating}}, function (err) {
                            if (err) {throw err;}
                        });
                    });




                });
            }
        });

    });

}
