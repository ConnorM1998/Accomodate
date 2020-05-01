var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Accomodation = require("./models/accomodation");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var localPassport = require("passport-local");
var User = require("./models/user");

//27017 = mongoDB's default port that mongod is running on
mongoose.connect("mongodb://localhost:27017/accomodate", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true})); //tells express to user body-parser
app.set("view engine", "ejs"); //Removes the need for adding ejs file extension
app.use(express.static(__dirname + "/public"));
seedDB(); //fills db with generic accomodations + comment


//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Secret Test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passes the request.user to all templates (handles whether to add Logout to header)
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});





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
            //res.render("accomodations/index", {accomodations:allAccomodation});
            res.render("accomodations/index", {accomodations:allAccomodation, currentUser: req.user}); //

        }
    });
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
    res.render("accomodations/new");
});


//SHOW - expands information on an individual accomodation
app.get("/accomodations/:id", function(req, res){
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

//==================
//NESTED COMMENT ROUTES
//==================
//isLogged checks if the user is logged in, if so they may add a new comment
app.get("/accomodations/:id/comments/new",isLoggedIn, function(req, res){
    //find accomodation by the ID
    Accomodation.findById(req.params.id, function(err, accomodation){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {accomodation: accomodation});
        }
    })
});

app.post("/accomodations/:id/comments", function(req, res){
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
                    accomdodation.comments.push(comment);
                    accomdodation.save();
                    res.redirect('/accomodations/'+accomdodation._id);
                }
            });
        }
    });
    //create new comment
    //connect the new comment to the accomdodation
    //redirect to accomodations show page
});



//=============== AUTH ROUTES
//show register form
app.get("/register", function(req, res){
    res.render("register");
});
//handles sign up logic
app.post("/register", function(req, res){
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
app.get("/login", function(req,res){
    res.render("login")
});
//handling login logic - compares input to accounts in database and decides redirect location
//"/login", -> middleware -> callback
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/accomodations",
        failureRedirect: "/login"
    }), function(req,res){
    //res.send("Login logic test");
});

//logout route
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/accomodations");
});


//
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        //Next refers to the next step in the function (just carries on), else it redirects
        return next();
    }
    res.redirect("/login");
}



//Sets localhost port to 3000, states a message if successful
app.listen(3000, function(){
    console.log("The Server has started");
})