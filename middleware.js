const Listing = require("./models/listing");
const Review = require("./models/Review.js");
const { listingSchema, ReviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.validateListing = (req, res, next) =>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errmsg)
    } else{
        next();
    }
}

module.exports.validateReview = (req, res, next) =>{
    let { error } = ReviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errmsg)
    } else{
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log("sessionUrl :",req.session.redirectUrl)
        req.flash("error", "You need to Logged in ");
        return res.redirect("/login")
    } else {
        next();
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log("Redirecting to:", res.locals.redirectUrl)
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id} = req.params;
    let {reviewId} = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listing/${id}`)
    }
    next();
}

