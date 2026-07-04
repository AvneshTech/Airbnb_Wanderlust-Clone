// NEW model - did not exist in the original EJS app.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.checkInDate && value > this.checkInDate;
      },
      message: "checkOutDate must be after checkInDate",
    },
  },
  numberOfGuests: {
    type: Number,
    min: 1,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for "my bookings" queries (filtered by guest, sorted by newest first).
bookingSchema.index({ guest: 1, createdAt: -1 });
// Index for quickly finding all bookings for a given listing (e.g. overlap checks).
bookingSchema.index({ listing: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
