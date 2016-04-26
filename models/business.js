var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var businessSchema = mongoose.Schema({
    businessName : String,
    phoneNumber : Double,
    email : String,
    address     : {
        street       : String,
        number       : String,
        population   : String,
        zip          : Double,
        city         : String,
        country      : String
    },
    loc     : {
        lng : Double,
        lat : Double
    },
    registrationData : Timestamp,
    profileImg : String,
    rating: Double
});

//extra methods for the schema
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8)); //synchronous hashing
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password); //synchronous password comparison
};

module.exports = mongoose.model('Business', userSchema);
