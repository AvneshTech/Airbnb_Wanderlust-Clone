// Bug #8 fix: reject malformed ObjectIds with a clean 400 instead of a Mongoose CastError 500.
const mongoose = require("mongoose");

// Validates the named route params (defaults to "id").
const validateObjectId = (...paramNames) => {
  const names = paramNames.length ? paramNames : ["id"];
  return (req, res, next) => {
    for (const name of names) {
      const value = req.params[name];
      if (value !== undefined && !mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({ message: `Invalid id: ${value}` });
      }
    }
    next();
  };
};

module.exports = validateObjectId;
