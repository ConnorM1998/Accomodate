var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Accomodation = require("./models/accomodation");


//27017 = mongoDB's default port that mongod is running on
mongoose.connect("mongodb://localhost:27017/accomodate", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true})); //tells express to user body-parser
app.set("view engine", "ejs"); //Removes the need for adding ejs file extension



// Accomodation.create(
//     {   
//         name: "test", 
//         image: "https://images.pexels.com/photos/65438/pexels-photo-65438.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
//         description: "THis is a description test"
//     }, 
//     function(err, accomodation){
//         if(err){
//             console.log(err)
//         } else {
//             console.log("NEW ACCOMODATION: ");
//             console.log(accomodation);
//         }
//     });




//Sets the root route to landing.ejs
app.get("/", function(req, res){
    res.render("landing"); //is views/landing.ejs
});

//Adds new route "accomodations", which displays an array that contains an accomodation list of 
//"name" aswell as "image" to accompany it
//GET method - Displays all accomodations
//INDEX ROUTE - shows all accomodations
app.get("/accomodations", function(req, res){
    //Get all accomodations from the database
    Accomodation.find({}, function(err, allAccomodation){
        if(err){
            console.log(err);
        } else {     
            //Allows the database to be displayed on the "accomodations page"       
            res.render("index", {accomodations:allAccomodation});
        }

    })

});

//Handles adding new accomodations to the accomodation array, then redirecting to accomodations page
//POST method
//CREATE ROUTE- adds new accomodation to db
app.post("/accomodations", function(req,res){
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
app.get("/accomodations/new", function (req, res){
    res.render("new.ejs");
});


//SHOW - expands information on an individual accomodation
app.get("/accomodations/:id", function(req, res){
    //find accomodation with provided ID
    Accomodation.findById(req.params.id, function(err, foundAccomodation){
        if(err){
            console.log(err);
        } else {
            //render show template of that accomodation
            res.render("show", {accomodations: foundAccomodation});
        }

    });

});


//Sets localhost port to 3000, states a message if successful
app.listen(3000, function(){
    console.log("The Server has started");
})