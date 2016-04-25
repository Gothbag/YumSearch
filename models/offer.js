var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var offerSchema = mongoose.Schema({
    name: String,
    priceBefore: Double,
    priceNow: Double
});

module.exports = mongoose.model('Offers', offerSchema);
