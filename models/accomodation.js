//This class handles the accomodationSchema, and will be called in when required
//Taken out of APP.JS for structural reasons, plus making the code neater
var mongoose = require("mongoose");

//SCHEMA
var accomodationSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//IMPORTANT-allows the module to be exported for use in app.js
module.exports = mongoose.model("Accomodation", accomodationSchema);