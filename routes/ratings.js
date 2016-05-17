var Rating = require('../models/rating');
var ObjectId = require('mongoose').Types.ObjectId;
var shared = require('../config/shared');

module.exports = function (app) {

    app.get('/user/ratings/postRating', shared.isAuthenticated, function(req, res) {
        res.render('pages/users/postRating.ejs', { title: 'Personal', user: req.user });
    });

    app.get('/user/ratings', shared.isAuthenticated, function(req, res) {
        res.send('Load all comments of current user');
    });
}
