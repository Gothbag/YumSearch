var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var offerSchema = mongoose.Schema({
    name: String,
    priceBefore: Double,
    priceNow: Double
});

//extra methods for the schema
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8)); //synchronous hashing
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password); //synchronous password comparison
};

module.exports = mongoose.model('Offers', offerSchema);
