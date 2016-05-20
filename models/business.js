var mongoose = require('mongoose');

// define the schema for our user model
var businessSchema = mongoose.Schema({
    name : String,
    phoneNumber : String,
    email: String,
    address     : {
        address : String,
        city : String,
        postCode : String,
        country : String
    },
    loc     : {type:[Number], index:'2d'},
    createdAt: { type: Date, default: Date.now },
    profileImg : String,
    rating: Number,
    avgRating: Number
});

module.exports = mongoose.model('Business', businessSchema);
