var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// define the schema for our user model
var adminSchema = mongoose.Schema({
    username     : String,
    password     : String,
    email        : String
});

//extra methods for the schema
adminSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8)); //synchronous hashing
};

adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password); //synchronous password comparison
};

module.exports = mongoose.model('Admin', adminSchema);
