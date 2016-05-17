var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var ratingSchema = mongoose.Schema({
    comment: String,
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    score: Number
});

module.exports = mongoose.model('Rating', ratingSchema);
