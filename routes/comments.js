var express = require("express");

var expressRouter = express.Router();

//Adds the models so the relevant variables are defined
var Accomodation = require("../models/accomodation")
var Comment = require("../models/comment")

//==================
//NESTED COMMENT ROUTES
//==================
    //create new comment
    //connect the new comment to the accomdodation
    //redirect to accomodations show page
//isLogged checks if the user is logged in, if so they may add a new comment

//Comments NEW
expressRouter.get("/accomodations/:id/comments/new",isLoggedIn, function(req, res){
    //find accomodation by the ID
    Accomodation.findById(req.params.id, function(err, accomodation){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {accomodation: accomodation});
        }
    })
});

//Comments Creates
expressRouter.post("/accomodations/:id/comments", function(req, res){
    //lookup accomodation using ID
    Accomodation.findById(req.params.id, function(err, accomdodation){
        if(err){
            console.log(err)
            res.redirect("/accomodations");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //--add username + id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //console.log("New comments username will be: " + req.user.username);
                    //--then save comment
                    comment.save();
                    
                    accomdodation.comments.push(comment);
                    accomdodation.save();                    
                    res.redirect('/accomodations/'+accomdodation._id);
                }
            });
        }
    });

});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        //Next refers to the next step in the function (just carries on), else it redirects
        return next();
    }
    res.redirect("/login");
}

module.exports = expressRouter;
