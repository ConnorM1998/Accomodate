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
expressRouter.post("/accomodations", function(req,res){
    //Recieve data from a form and add to accomodation db
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    var newAccomodation = {name:name, image:image, description:desc}
    //create new Accomodation + save to db
    Accomodation.create(newAccomodation, function(err, createdAccomodation){
        if(err){
            console.log(err)
        } else {
            //Redirect to 'accomodations' page
            res.redirect("/accomodations");
        }
    });
});

//Handles the form that takes user input, sends POST request to "/accomodations", 
//which then redirects to "/accomodations" GET (displaying all accomodations)
//PUT method
//NEW ROUTE - displays form to create new accomodation
expressRouter.get("/accomodations/new", function (req, res){
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

module.exports = expressRouter;