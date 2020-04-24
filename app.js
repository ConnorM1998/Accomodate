var express = require("express");
var app = express();
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true})); //tells express to user body-parser
app.set("view engine", "ejs"); //Removes the need for adding ejs file extension

//Sets the root route to landing.ejs
app.get("/", function(req, res){
    res.render("landing"); //is views/landing.ejs
});

//Adds new route "accomodations", which displays an array that contains an accomodation list of 
//"name" aswell as "image" to accompany it
app.get("/accomodations", function(req, res){
    var accomodations = [
        {name: "Woolman hill", image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"},
        {name: "Crathie Student Village", image: "https://www.rgu.ac.uk/images/Accommodation/Crathie.jpg"},
        {name: "Garthdee Towers", image: "https://www.rgu.ac.uk/images/Accommodation/GarthdeeTowers.jpg"}
    ]

    //Allows the array to be displayed on the "accomodations page"
    res.render("accomodations", {accomodations:accomodations});

});

//add POST route
app.post("/accomodations", function(req,res){
    //Recieve data from a form and add to accomodation array
    //Redirect 'to accomodations' page
    res.send("POST route")
});



//Sets localhost port to 3000, states a message if successful
app.listen(3000, function(){
    console.log("The Server has started");
})