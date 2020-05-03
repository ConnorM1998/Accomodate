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