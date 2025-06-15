const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllersUser = require("../controllers/users.js");

router
 .route("/signup")
 .get(controllersUser.renderSignUpForm)
 .post(wrapAsync(controllersUser.signup))

router
 .route("/login")
 .get(
    controllersUser.renderLoginForm
 )
 .post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect : "/login",
        failureFlash : true
    }),
    controllersUser.Login
 )

router.get(
    "/logout",
    controllersUser.Logout
)

module.exports = router;