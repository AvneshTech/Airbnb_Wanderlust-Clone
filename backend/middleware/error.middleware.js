// Central error handler. Always returns JSON, never renders a view.
const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  // Normalise common Mongoose errors into clean responses.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
