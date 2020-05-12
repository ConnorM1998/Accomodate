// This class handles the routing of all the pages related 
//to accomodations (found in views/accomodations)

var express = require("express");
var expressRouter = express.Router();

//provides the accomodationSchema, allowing for accomodations to be passed 
var Accomodation = require("../models/accomodation");



//Adds new route "accomodations", which displays an array that contains an accomodation list of 
//"name" aswell as "image" to accompany it
//GET method - Displays all accomodations
//INDEX ROUTE - shows all accomodations
expressRouter.get("/accomodations", function(req, res){
    //Get all accomodations from the database
    Accomodation.find({}, function(err, allAccomodation){
        if(err){
            console.log(err);
        } else {     
            //Allows the database to be displayed on the "accomodations page"       
            //res.render("accomodations/index", {accomodations:allAccomodation});
            res.render("accomodations/index", {accomodations:allAccomodation, currentUser: req.user}); //
        }
    });
});

//Handles adding new accomodations to the accomodation array, then redirecting to accomodations page
//POST method
//CREATE ROUTE- adds new accomodation to db
expressRouter.post("/accomodations", isLoggedIn, function(req,res){
    //Recieve data from a form and add to accomodation db
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;

    //THe user that added the accomodation
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newAccomodation = {name:name, image:image, price:price, description:desc, author:author}
    console.log(req.user);
    //create new Accomodation + save to db
    Accomodation.create(newAccomodation, function(err, createdAccomodation){
        if(err){
            console.log(err)
        } else {
            //Redirect to 'accomodations' page
            console.log(createdAccomodation);
            res.redirect("/accomodations");
        }
    });
});

//Handles the form that takes user input, sends POST request to "/accomodations", 
//which then redirects to "/accomodations" GET (displaying all accomodations)
//PUT method
//NEW ROUTE - displays form to create new accomodation
expressRouter.get("/accomodations/new", isLoggedIn, function (req, res){
    res.render("accomodations/new");
});


//SHOW - expands information on an individual accomodation
expressRouter.get("/accomodations/:id", function(req, res){
    //find accomodation with provided ID
    //Populates comment array on accomodation
    Accomodation.findById(req.params.id).populate("comments").exec(function(err, foundAccomodation){  //.populate adds the comments (not just ID) 
        if(err){
            console.log(err);
        } else {
            console.log(foundAccomodation)
            //render show template of that accomodation
            res.render("accomodations/show", {accomodation: foundAccomodation});
        }
    });
});





//Edit accomodation - Provides a form the user can change
expressRouter.get("/accomodations/:id/edit", checkOwnership, function(req, res){
    Accomodation.findById(req.params.id, function(err, foundAccomodation){
        res.render("accomodations/edit", {accomodation: foundAccomodation});       
    });
});

//Update accomodation - Where the edit form is pushed to
expressRouter.put("/accomodations/:id",checkOwnership, function(req, res){
    //find and update correct accomodation
    Accomodation.findByIdAndUpdate(req.params.id, req.body.accomodation, function(err, updatedAcc){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/accomodations/" + req.params.id);     //redirect to accomodation that was edited

        }
    });
});

//Remove accomodation
expressRouter.delete("/accomodations/:id",checkOwnership, function(req, res){
    // res.send("ATTEMPT AT REMOVING ACCOMODATION")
    Accomodation.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/accomodations");
        } else {
            res.redirect("/accomodations");
        }
    });
});



//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        //Next refers to the next step in the function (just carries on), else it redirects
        return next();
    }
    res.redirect("/login");
}


function checkOwnership(req, res, next) {
    //Checks user is logged in
    if(req.isAuthenticated()){
        //Gets accomodation from db
        Accomodation.findById(req.params.id, function(err, foundAccomodation){
            if(err){
                res.redirect("back")
            }else {
                //Does user own accomodation?
                if(foundAccomodation.author.id.equals(req.user._id)){  //Check if author.id of accomodation matches currently logged in user's id
                    next(); //proceed
                } else{
                    console.log("You are not the owner, thus don't have permission");
                    res.redirect("back");
                }
            }
        });
    }else {
        console.log("Login required for this action");
        res.redirect("back");
    }
}


module.exports = expressRouter;