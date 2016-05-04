var mongoose = require('mongoose');

// define the schema for our user model
var businessSchema = mongoose.Schema({
    businessName : String,
    phoneNumber : String,
    address     : {
        address : String,
        city : String,
        postCode : String,
        country : String
    },
    loc     : {
        lng : Number,
        lat : Number
    },
    createdAt: { type: Date, default: Date.now },
    profileImg : String,
    rating: Number
});

module.exports = mongoose.model('Business', businessSchema);
