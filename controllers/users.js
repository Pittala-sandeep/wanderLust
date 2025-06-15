const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res, next) => {
    try{
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        let registerdUser = await User.register(newUser, password);
        req.logIn(registerdUser, ((err) =>{
            if(err){
                next(err);
            } else {
                req.flash("success", "You are logged in!");
                return res.redirect("/listing")
            }
        }))
    } catch(e){
        req.flash("error", e.message);
        return res.redirect("/signup")
    }

}

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs")
}

module.exports.Login = async (req, res) => {
        req.flash("success", "Welcome back to WanderLust")
        let redirectUrl = res.locals.redirectUrl || "/listing"
        res.redirect(redirectUrl)
}

module.exports.Logout = async (req, res, next) => {
    req.logOut((err) =>{
        if(err){
            next(err);
        } else {
            req.flash("success", "You are logged out!");
            return res.redirect("/listing")
        }
    })
}