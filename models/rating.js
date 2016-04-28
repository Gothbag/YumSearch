var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var ratingSchema = mongoose.Schema({
    comment: String,
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    score: Integer
});

module.exports = mongoose.model('Ratings', ratingSchema);
