const catchAsync = require("../utils/catchAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.model.js");
const Review = require("../models/review.model.js");
const Booking = require("../models/booking.model.js");

// Requires an authenticated session. Returns 401 JSON instead of redirecting.
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in first" });
  }
  next();
};

// Bug #3 fix: wrapped in catchAsync + defensive truthiness checks before .equals().
const isOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    return res.status(403).json({ message: "You are not the owner of this listing" });
  }
  next();
});

const isReviewAuthor = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ExpressError(404, "Review not found");
  }
  if (!review.author || !review.author.equals(req.user._id)) {
    return res.status(403).json({ message: "You are not the author of this review" });
  }
  next();
});

// Bookings are private to their guest.
const isBookingOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ExpressError(404, "Booking not found");
  }
  if (!booking.guest || !booking.guest.equals(req.user._id)) {
    return res.status(403).json({ message: "You are not allowed to access this booking" });
  }
  req.booking = booking; // hand the loaded doc to the controller
  next();
});

module.exports = { isLoggedIn, isOwner, isReviewAuthor, isBookingOwner };
