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

  // Multer errors (file-size limit, wrong MIME type) are always client errors.
  // MulterError carries a .code ("LIMIT_FILE_SIZE" etc.); the fileFilter path
  // sets .statusCode = 400 directly on the Error it passes to cb().
  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.code === "LIMIT_FILE_SIZE"
      ? "File is too large. Maximum size is 5 MB"
      : err.message;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
