var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    firstName : String,
    lastName: String,
    creationDate: Date,
    profileimage: String,
    businesses: mongoose.Schema.Types.ObjectId,
    local            : {
        email        : String,
        username     : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    webmaster: Boolean

});

//extra methods for the schema
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8)); //synchronous hashing
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password); //synchronous password comparison
};

module.exports = mongoose.model('User', userSchema);
