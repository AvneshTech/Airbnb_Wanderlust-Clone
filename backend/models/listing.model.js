const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model.js");
// Lazy require to avoid circular dependency (Booking -> Listing -> Booking).
const getBookingModel = () => require("./booking.model.js");

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

// Cascade-delete reviews and bookings when a listing is removed so no
// orphaned documents accumulate in the database.
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    await getBookingModel().deleteMany({ listing: listing._id });
  }
});

// Indexes that support the most common query patterns:
//   - category filter  ->  { category: 1 }
//   - text search on title / location / country  ->  compound text index
//   - "my listings" queries by owner  ->  { owner: 1 }
listingSchema.index({ category: 1 });
listingSchema.index({ title: "text", location: "text", country: "text" });
listingSchema.index({ owner: 1 });

module.exports = mongoose.model("Listing", listingSchema);
