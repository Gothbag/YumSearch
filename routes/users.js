var _ = require('underscore');
var ObjectId = require('mongoose').Types.ObjectId;

var shared = require('../config/shared');

//User and Rating model
var User = require('../models/user');
var Rating = require('../models/rating');

//Mail stuff
var nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const transport = nodemailer.createTransport('SMTP',{
    service: 'gmail',
    auth: {
        user: 'yumsearchcompany@gmail.com', // my mail
        pass: 'yumsearchco'
    }
});

module.exports = function (app, passport) {

    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user) {

            if (err) { return next(err); }
            if (!user) { return res.json({success:false}); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                var mailOptions={
                    transport : transport,
                    from : 'yumsearchcompany@gmail.com',
                    to : user.local.email,
                    subject : "Welcome to YumSearch",
                    text : "Hello " + user.local.username + "!\n\nNow you are a yummer forever. Save money searching food products in our webpage"
                }
                console.log(mailOptions);
                console.log(smtpTransport);
                transport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                        return next(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }
                });

                res.json({"success" :true, "status" : 200});
            });
        })(req, res, next);

    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user) {

            if (err) { return next(err); }
            if (!user) { return res.json({success:false, "status" : 200}); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                if (user.webmaster == true) {
                    return res.json({"success" : true, "status" : 200, "webmaster": true});
                } else if (ObjectId.isValid(user.businesses)) {
                    return res.json({"success" : true, "status" : 200, "business": true});
                }
                res.json({"success" :true, "status" : 200});
            });
        })(req, res, next);

    });

    app.post('/users/emailexists', function (req, res) {
        User.findOne({ '    local.email': req.body.email }, function (err, user) {
            if (err) { throw err;}
            // a user is found, we return true
            if (user) {return res.send(true);}
            //no users have been found
            return res.send(false);
        });

    });

    app.post('/users/usernameexists', function (req, res) {
        User.findOne({ 'local.username': req.body.username }, function (err, user) {
            if (err) { throw err;}
            // a user is found, we return true
            if (user) {return res.send(true);}
            //no users have been found
            return res.send(false);
        });

    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /* GET users listing. */
    app.get('/users/personal',shared.isAuthenticated, function(req, res, next) {
        Rating.count({from:req.user._id}, function( err, ratingcount){
            if (err) {throw err;}
            res.render('pages/users/userArea.ejs', { title: 'Personal', user: req.user, ratingcount: ratingcount });
        });
    });

    /*to render the page where profiles are edited*/
    app.get('/editprofile', shared.isAuthenticated, function(req, res) {
        var userSubset = _.pick(req.user, 'firstName', 'lastName'); //we only pick the properties we need
        userSubset.local = {};
        userSubset.local.email = req.user.local.email;
        userSubset.local.username = req.user.local.username;
        res.render('pages/users/editprofile.ejs', { title: 'Edit profile', user: userSubset });
    });

    /* user update POST request */
    app.post('/users/updateuser', function (req, res, next) {
        User.findOne({_id:req.user._id}, function (err, user) {
            if (!user) { return res.json({"success" :false, "status" : 500});}
            var changedVals = JSON.parse(req.body.changedValues);
            var updateObject = {};
            if (changedVals.password + "" != "") {
                if (user.validPassword(changedVals.oldPassword)) {
                    user.local.password = user.generateHash(changedVals.password);
                } else {
                    return res.json({"success" :false, "status" : 500});
                }
            }
            var id = user._id;
            //We prepare an object to update whatever needs to be updated
            if (changedVals.email + "" != "") {
                user.local.email = changedVals.email;
            }

            user.email = changedVals.email;
            user.lastName = changedVals.lastName;
            user.firstName = changedVals.firstName;

            User.update({_id:id}, user, function (err) {
                if (err) {throw err;}
                res.json({"success" :true, "status" : 200});
            });
        });

    });

    app.get('/user/profile/:id', function(req, res) { //the populate function will "populate" the businesses that have been rated by the user
        var id = req.params.id;
        User.find({_id:id}, function (err, user) {
            if (user.length <= 0) {
                res.redirect("/");
            } else {
                user = user[0];
            }

             Rating.find({from: user._id }) //we find all ratings by the user
                .populate('to')
                .exec(function (err, ratings) {
                    if (err) { throw err; }
                    res.render('pages/users/profile.ejs', { title: 'User Profile ' + user.name, userShown: user,user: req.user, ratings: ratings });
            });
        });

    });
};


