var express = require("express");
var app = express();
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true})); //tells express to user body-parser
app.set("view engine", "ejs"); //Removes the need for adding ejs file extension


var accomodations = [
    {name: "Woolman hill", image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"},
    {name: "Crathie Student Village", image: "https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"},
    {name: "Garthdee Towers", image: "https://images.pexels.com/photos/417273/pexels-photo-417273.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
];


//Sets the root route to landing.ejs
app.get("/", function(req, res){
    res.render("landing"); //is views/landing.ejs
});

//Adds new route "accomodations", which displays an array that contains an accomodation list of 
//"name" aswell as "image" to accompany it
//GET method - Displays all accomodations
app.get("/accomodations", function(req, res){
    //Allows the array to be displayed on the "accomodations page"
    res.render("accomodations", {accomodations:accomodations});
});

//Handles adding new accomodations to the accomodation array, then redirecting to accomodations page
//POST method
app.post("/accomodations", function(req,res){
    //Recieve data from a form and add to accomodation array
    var name = req.body.name;
    var image = req.body.image;
    var newAccomodation = {name:name, image:image}
    accomodations.push(newAccomodation)
    //Redirect 'to accomodations' page
    res.redirect("/accomodations");
});

//Handles the form that takes user input, sends POST request to "/accomodations", 
//which then redirects to "/accomodations" GET (displaying all campgrounds)
//PUT method
app.get("/accomodations/new", function (req, res){
    res.render("new.ejs");
});

//Sets localhost port to 3000, states a message if successful
app.listen(3000, function(){
    console.log("The Server has started");
})