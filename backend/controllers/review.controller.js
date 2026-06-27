const Listing = require("../models/listing.model.js");
const Review = require("../models/review.model.js");
const ExpressError = require("../utils/ExpressError.js");

// POST /api/listings/:listingId/reviews  (auth)
module.exports.createReview = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);

  // Bug #2 fix: 404 if the listing doesn't exist before pushing a review.
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const review = new Review(req.body);
  review.author = req.user._id;
  listing.reviews.push(review);

  await review.save();
  await listing.save();
  await review.populate("author", "username");

  res.status(201).json({ message: "Review added", review });
};

// DELETE /api/listings/:listingId/reviews/:reviewId  (auth + author)
module.exports.deleteReview = async (req, res) => {
  const { listingId, reviewId } = req.params;
  await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ message: "Review deleted" });
};
