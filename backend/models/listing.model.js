const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  // Bug #7 fix: price is required with a min, so bad data can't enter the DB.
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "beach", "mountain", "city", "farms", "snow",
      "lakes", "camping", "boats", "rooms", "trending",
    ],
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  // Bug #3 fix: owner is now required.
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Cascade-delete reviews when a listing is removed.
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
