const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const controllerReview = require("../controllers/review.js")

// Post Review Route
router.post(
    "/",
    validateReview,
    isLoggedIn,
    wrapAsync(controllerReview.createReview)
)

// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(controllerReview.destroyReview)
)

module.exports = router;