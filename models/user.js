//This class handles the schema for users, and will be called in when required
//Taken out of APP.JS for structural reasons, plus making the code neater

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// plugin - implements methods that can be used to test the user 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);