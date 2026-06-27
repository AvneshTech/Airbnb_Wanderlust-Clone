const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema, bookingSchema, signupSchema } = require("../schema/joiSchemas.js");

const makeValidator = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  req.body = value; // use the coerced/defaulted values
  next();
};

module.exports = {
  validateListing: makeValidator(listingSchema),
  validateReview: makeValidator(reviewSchema),
  validateBooking: makeValidator(bookingSchema),
  validateSignup: makeValidator(signupSchema),
};
