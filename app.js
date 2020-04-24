var express = require("express");
var app = express();

app.set("view engine", "ejs"); //Removes the need for adding ejs file extension

//root
app.get("/", function(req, res){
    res.render("landing"); //is views/landing.ejs
});

app.get("/accomodations", function(req, res){
    var accomodations = [
        {name: "Woolman hill", image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"},
        {name: "Crathie Student Village", image: "https://www.rgu.ac.uk/images/Accommodation/Crathie.jpg"},
        {name: "Garthdee Towers", image: "https://www.rgu.ac.uk/images/Accommodation/GarthdeeTowers.jpg"}
    ]

    res.render("accomodations", {accomodations:accomodations});

});

app.listen(3000, function(){
    console.log("The Server has started");
})