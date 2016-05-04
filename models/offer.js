var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our offer model
var offerSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    name: String,
    priceBefore: Number,
    priceNow: Number,
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
});

module.exports = mongoose.model('Offers', offerSchema);
