//TESTING PURPOSES - creates a database with comments added

var mongoose = require("mongoose");
var Accomodation = require("./models/accomodation");
var Comment = require("./models/comment");

//The generic accomodations that will be added upon server run
var accData = [
    {
        name: "Heaven", 
        image: "https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        description: "OOOOOH HEAVEN IS A PLACE ON EARTH"
    },
    {
        name: "HELL", 
        image: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        description: "too hot in here"
    },
    {
        name: "Earth", 
        image: "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        description: "Is she flat or round?"
    },
    {
        name: "Jupiter", 
        image: "https://images.pexels.com/photos/3798187/pexels-photo-3798187.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        description: "too hot in here"
    },
    {
        name: "Sun", 
        image: "https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        description: "too hot in here"
    }
]

function seedDB(){
    //Removes all Accomodations
    Accomodation.remove({}, function(err){
        // if(err){
        //     console.log(err);
        // }
        // console.log("Removed Accomodations!")
        // //Adds Generic Accomodations - Loops through the accData array, adding each accomodation
        // //Needs to be in here so added after initial removal, otherwise random  
        // accData.forEach(function(seed){
        //     Accomodation.create(seed, function(err, accomodation){
        //         if(err){
        //             console.log(err)
        //         } else {
        //             console.log("Added an Accomodation")
        //             //Create a comment for the accomodation
        //             Comment.create(
        //                 {
        //                     text:"Yeah it's okay",
        //                     author: "User-1"
        //                 }, function(err, comment){
        //                     if(err){
        //                         console.log(err)
        //                     } else{
        //                         accomodation.comments.push(comment); //assoiciates it with an accomodation - pushing it into 'comments' array for the acommodations
        //                         accomodation.save()
        //                         console.log("Comment Created")
        //                     }
        //                 });
        //         } 
        //     });
        // });
    });

    //Add Comments to Accomodations
}

module.exports = seedDB;
