var Rating = require('../models/rating');
var Business = require('../models/business');
var ObjectId = require('mongoose').Types.ObjectId;
var shared = require('../config/shared');

module.exports = function (app) {

    app.get('/user/ratings/postRating', shared.isAuthenticated, function(req, res) {
        res.render('pages/users/postRating.ejs', { title: 'Personal', user: req.user });
    });

    app.post('/ratings/post', function(req, res) {

        var businessId =req.body.businessId;

        var newRating = {};
        newRating.comment = req.body.comment;
        newRating.score = req.body.score;
        newRating.from = req.user._id;

        Business.findOne({_id: businessId }, function (err, business) {
            if (err) {throw err;}
            if (business) {
                newRating.to = business._id;
                Rating.update({to:business._id, from: req.user._id}, newRating, {upsert:true, setDefaultsOnInsert: true}, function (err) {
                    if (err) { return done(err); }
                    //we obtain the average of the ratings given to this business
                    Rating.aggregate([{$match:{to:business._id}},{$group:{_id:null,avgRating:{$avg:"$score"}}}], function (err, result) {
                        if (err) {throw err;}
                         Business.update({_id:business._id}, {$set:{avgRating:result[0].avgRating}}, function (err) {
                            if (err) {throw err;}
                             res.json({"success" :true, "status" : 200});
                        });
                    });

                });
            }
        });

    });

}
