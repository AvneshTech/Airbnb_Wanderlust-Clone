const express = require("express");
const router = express.Router({ mergeParams : true });//mergeParams is external options for accessing child-parent - reder docx
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controller/review.js");

// review route
router.post("/", isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

// review delete route
router.delete("/:reviewId",isLoggedIn , isReviewAuthor, wrapAsync (reviewController.deleteReview));

module.exports = router;
