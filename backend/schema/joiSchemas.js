const Joi = require("joi");

// NOTE: the new JSON API accepts flat bodies (no nested "listing[...]" wrapper),
// which is the natural shape for React + axios JSON requests.

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  category: Joi.string()
    .valid("beach", "mountain", "city", "farms", "snow", "lakes", "camping", "boats", "rooms", "trending")
    .required(),
  // image is handled via multipart file upload, not validated here.
  image: Joi.any().optional(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required(),
});

const bookingSchema = Joi.object({
  listingId: Joi.string().required(),
  checkInDate: Joi.date().min("now").required().messages({
    "date.min": "checkInDate cannot be in the past",
  }),
  checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required().messages({
    "date.greater": "checkOutDate must be after checkInDate",
  }),
  numberOfGuests: Joi.number().integer().min(1).default(1),
});

// Bug #10 fix: enforce a minimum password length on signup (server side).
const signupSchema = Joi.object({
  username: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
  }),
});

module.exports = { listingSchema, reviewSchema, bookingSchema, signupSchema };
