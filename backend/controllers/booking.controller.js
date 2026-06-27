// NEW controller - the full booking flow did not exist in the original app.
const Booking = require("../models/booking.model.js");
const Listing = require("../models/listing.model.js");
const ExpressError = require("../utils/ExpressError.js");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// POST /api/bookings  (auth)  body: { listingId, checkInDate, checkOutDate, numberOfGuests }
module.exports.createBooking = async (req, res) => {
  const { listingId, checkInDate, checkOutDate, numberOfGuests } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const nights = Math.round((end - start) / MS_PER_DAY);
  if (nights <= 0) {
    throw new ExpressError(400, "checkOutDate must be after checkInDate");
  }

  // Server calculates the price; never trust a client-sent total.
  const totalPrice = listing.price * nights;

  const booking = await Booking.create({
    listing: listing._id,
    guest: req.user._id,
    checkInDate: start,
    checkOutDate: end,
    numberOfGuests: numberOfGuests || 1,
    totalPrice,
    status: "pending",
  });

  await booking.populate("listing", "title image price location country");
  res.status(201).json({ message: "Booking created", booking });
};

// GET /api/bookings/my  (auth)
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate("listing", "title image price location country")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

// GET /api/bookings/:id  (auth + guest) - booking is pre-loaded by isBookingOwner.
module.exports.showBooking = async (req, res) => {
  await req.booking.populate("listing", "title image price location country");
  res.json(req.booking);
};

// PATCH /api/bookings/:id/confirm  (auth + guest) - step 3 of the multi-step flow.
module.exports.confirmBooking = async (req, res) => {
  const booking = req.booking;
  if (booking.status === "cancelled") {
    throw new ExpressError(400, "Cannot confirm a cancelled booking");
  }
  booking.status = "confirmed";
  await booking.save();
  await booking.populate("listing", "title image price location country");
  res.json({ message: "Booking confirmed", booking });
};

// DELETE /api/bookings/:id  (auth + guest) - cancel.
module.exports.cancelBooking = async (req, res) => {
  const booking = req.booking;
  booking.status = "cancelled";
  await booking.save();
  res.json({ message: "Booking cancelled", booking });
};
