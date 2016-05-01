var mongoose = require('mongoose');

// define the schema for our user model
var businessSchema = mongoose.Schema({
    businessName : String,
    phoneNumber : Number,
    email : String,
    address     : {
        address       : String,
        city   : String,
        postCode          : Number,
        country      : Number
    },
    loc     : {
        lng : Number,
        lat : Number
    },
    creationDate : Date,
    profileImg : String,
    rating: Number
});

module.exports = mongoose.model('Business', businessSchema);
