var _ = require('underscore');
//Multer and all modules we need to upload files
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../', 'resources/img/profileimages'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
});
var upload = multer({ storage: storage });
var fs = require('fs');
var path = require('path');
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
                if (req.body.remember) {res.cookie('remember', user.local.username, { maxAge: 2629746000 });}
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
         res.render('pages/users/userArea.ejs', { title: 'Personal', user: req.user });
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
        var changedVals = JSON.parse(req.body.changedValues);
        var image = false;
        var id = req.user._id;
        //We prepare an object to update whatever needs to be updated
        if (changedVals.email + "" != "") {
            changedVals["local.email"] = changedVals.email;
        }
        console.log(changedVals);
        if (changedVals.password + "" != "") {
            var helpUser = new User;
            changedVals.local.password = helpUser.generateHash(password);
        }
        //deleting unwanted properties
        delete changedVals.email;
        delete changedVals.password;

        User.update({_id:req.user._id}, {$set:changedVals}, function (err) {
            if (err) {throw err;}
            res.json({"success" :true, "status" : 200});
        });
    });

    app.post('/users/avatarupload', upload.single("avatarupload"), function (req, res) {
        var image = false;
        var profileimage;
        console.log(req.file);
        console.log(req.files);
        if (req.file) {
            profileimage = req.file.filename;
            image = true;
        } else {
            profileimage = 'noimage.jpg';
        }
        var id = req.user._id + "";
        if (image) {
            fs.stat(path.join('profileimages', id), function (err, stats) { //the path won't accept an integer that's why we add the ""
                if (!stats.isDirectory) { //stats is an object with information on the file inspected
                    fs.mkdir(path.join('profileimages', id), function (err) { //we create the directory if it doesn't exist
                        if (!err) {
                            fs.rename(path.join('uploads', profileimage), path.join('profileimages', id, profileimage), function (err) {
                                if (err) {throw err;}
                            });
                        }
                    })
                }
            });

        }
        User.update({_id:id}, {$set:{profileimage:profileimage}}, function (err) {
            if (err) {throw err;}

        });
    });

    app.get('/user/ratings', shared.isAuthenticated, function(req, res) { //the populate function will "populate" the businesses that have been rated by the user
        Rating.find({from: req.user._id })
            .populate('from')
            .exec(function (err, ratings) {
                if (err) { throw err; }
                res.render('pages/business/receivedRatings.ejs', { title: 'Received Ratings', user: req.user, ratings: ratings });
        });
    });
};


