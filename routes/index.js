var express = require("express");

var expressRouter = express.Router();

//dependencies
var passport = require("passport");
var User = require("../models/user");


//Sets the root route to landing.ejs
expressRouter.get("/", function(req, res){
    res.render("landing"); //is views/landing.ejs
});





//=============== AUTH ROUTES
//show register form
expressRouter.get("/register", function(req, res){
    res.render("register");
});
//handles sign up logic
expressRouter.post("/register", function(req, res){
    //recieves data from form
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/accomodations");
        });
    });
    //res.send("Signing user up")
});

//show login form
expressRouter.get("/login", function(req,res){
    res.render("login")
});
//handling login logic - compares input to accounts in database and decides redirect location
//"/login", -> middleware -> callback
expressRouter.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/accomodations",
        failureRedirect: "/login"
    }), function(req,res){
    //res.send("Login logic test");
});

//logout route
expressRouter.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/accomodations");
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