const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync.js");
const validateObjectId = require("../middleware/validateObjectId.middleware.js");
const { isLoggedIn, isBookingOwner } = require("../middleware/auth.middleware.js");
const { validateBooking } = require("../middleware/validate.middleware.js");
const ctrl = require("../controllers/booking.controller.js");

// /api/bookings  (all NEW)
router.post("/", isLoggedIn, validateBooking, catchAsync(ctrl.createBooking));
router.get("/my", isLoggedIn, catchAsync(ctrl.myBookings));
router.get("/:id", validateObjectId("id"), isLoggedIn, isBookingOwner, catchAsync(ctrl.showBooking));
router.patch("/:id/confirm", validateObjectId("id"), isLoggedIn, isBookingOwner, catchAsync(ctrl.confirmBooking));
router.delete("/:id", validateObjectId("id"), isLoggedIn, isBookingOwner, catchAsync(ctrl.cancelBooking));

module.exports = router;
