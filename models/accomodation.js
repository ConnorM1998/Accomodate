//This class handles the accomodationSchema, and will be called in when required
//Taken out of APP.JS for structural reasons, plus making the code neater
var mongoose = require("mongoose");

//SCHEMA
var accomodationSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {       //Added so a link between the user and added accomodation is made
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"    
        }
    ]
});

//IMPORTANT-allows the module to be exported for use in app.js
module.exports = mongoose.model("Accomodation", accomodationSchema);