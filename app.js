if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js");
engine = require('ejs-mate')
const app = express();
const path = require("path");
const listingRoute = require("./router/listing.js")
const reviewsRoute = require("./router/review.js");
const userRoute = require("./router/users.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const dbUrl = process.env.ATLASDB_URL

main().then(() =>{
    console.log("connected to database")
}) .catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(dbUrl)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);


const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECERT
    },
    touchAfter:24*60*60
});

store.on("error", () =>{
    console.log("Error in mongo session", err)
})

const sessionOption = {
    store,
    secret : process.env.SECERT,
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listing", listingRoute)
app.use("/listing/:id/review", reviewsRoute)
app.use("/", userRoute)

app.all("{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message})
})

// connection to server
app.listen(3000,(req, res) => {
    console.log("server started")
}) 