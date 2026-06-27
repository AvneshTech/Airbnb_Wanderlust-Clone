const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync.js");
const validateObjectId = require("../middleware/validateObjectId.middleware.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware/auth.middleware.js");
const { validateReview } = require("../middleware/validate.middleware.js");
const ctrl = require("../controllers/review.controller.js");

// /api/listings/:listingId/reviews
router.post(
  "/",
  validateObjectId("listingId"),
  isLoggedIn,
  validateReview,
  catchAsync(ctrl.createReview)
);

router.delete(
  "/:reviewId",
  validateObjectId("listingId", "reviewId"),
  isLoggedIn,
  isReviewAuthor,
  catchAsync(ctrl.deleteReview)
);

module.exports = router;
