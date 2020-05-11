var express = require("express");

var expressRouter = express.Router();

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


//Edit accomodation
expressRouter.get("/accomodations/:id/edit", function(req, res){
    Accomodation.findById(req.params.id, function(err, foundAccomodation){
        if(err){
            res.redirect("/accomodations")
        }else {
            res.render("accomodations/edit", {accomodation: foundAccomodation});
        }
    });
});



//Update accomodation
expressRouter.put("/accomodations/:id", function(req, res){
    //find and update correct accomodation
    Accomodation.findByIdAndUpdate(req.params.id, req.body.accomodation, function(err, updatedAcc){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/accomodations/" + req.params.id);
        }
    });
    //redirect to index
});



//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        //Next refers to the next step in the function (just carries on), else it redirects
        return next();
    }
    res.redirect("/login");
}

module.exports = expressRouter;