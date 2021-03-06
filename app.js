//Packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localPassport = require("passport-local");
var methodOverride = require("method-override");

//File initialisation
var Accomodation = require("./models/accomodation");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");

//requiring routes / folders
var accRoutes = require("./routes/accomodations")
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")


//ONLY ONE MUST BE UNCOMMENTED!
//UN-COMMENT FOR MONGO ATLAS
mongoose.connect('mongodb+srv://admin:P@ssw0rd@cluster0-xkflm.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to Atlas DB");
}).catch(err => {
    console.log('ERROR:', err.message);
});
//---------------------------
//UN-COMMENT FOR LOCAL MONGO
// 27017 = mongoDB's default port that mongod is running on
//"useUnifiedTopology, useNewUrlParser,useUnifiedTopology" included due to deprecation warnings
// mongoose.connect("mongodb://localhost:27017/accomodate", {useUnifiedTopology: true, useNewUrlParser: true});
// mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({extended: true})); //tells express to user body-parser
app.set("view engine", "ejs"); //Removes the need for adding .ejs file extension
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); //tells override what to search for so it knows where to override i.e wherever "_method" is.
app.use(express.json()) //Used to Sanitise Input

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

//Passes the request.user to all templates/routes (handles whether to add Logout to header)
//empty-if no one logged in | contains username + id of user if logged in
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next(); //tells the function to carry on
});


//tells the app to use the stated route files
app.use(accRoutes);
app.use(commentRoutes);
app.use(indexRoutes);



//Sets localhost port to 3000, states a message if successful
var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("The Server has started");
})