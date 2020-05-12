//This class handles the schema for comments, and will be called in when required
//Taken out of APP.JS for structural reasons, plus making the code neater

var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {               //Making it an object allows a link between account and comment made
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});



module.exports = mongoose.model("Comment", commentSchema);