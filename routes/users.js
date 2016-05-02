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

//User model
var User = require('../models/user');

module.exports = function (app, passport) {

    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user) {

            if (err) { return next(err); }
            if (!user) { return res.json({success:false}); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
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
                if (user.webmaster == true)
                    res.json({"success" : true, "status" : 200, "webmaster": true});
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
    app.get('/users',isAuthenticated, function(req, res, next) {
        res.send('respond with a resource');
    });

    /* new user welcome page */
    app.get('/usercreated',isAuthenticated, function(req, res, next) {
        console.log(req.user);
        res.render('pages/users/usercreated.ejs', { title: 'User created successfully', user: req.user });
    });

    /*to render the page where profiles are edited*/
    app.get('/editprofile', isAuthenticated, function(req, res) {
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
            var helpUser = new User;
            changedVals["local.email"] = changedVals.email;
        }


        if (changedVals.password + "" != "") {
            var helpUser = new User;
            changedVals["local.password"] = helpUser.generateHash(password);
        }
        //deleting unwanted properties
        delete changedVals.email;
        delete changedVals.password;

        User.update({_id:req.user._id}, {$set:changedVals}, function (err) {
            if (err) {throw err;}

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

};

//function to verify the user is logged in
var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated()) { return next();}
    //if the user is not authenticated then we redirect them to the main page
    res.redirect('/');

};


