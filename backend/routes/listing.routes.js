const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary.config.js");
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const catchAsync = require("../utils/catchAsync.js");
const validateObjectId = require("../middleware/validateObjectId.middleware.js");
const { isLoggedIn, isOwner } = require("../middleware/auth.middleware.js");
const { validateListing } = require("../middleware/validate.middleware.js");
const ctrl = require("../controllers/listing.controller.js");

// /api/listings
router.get("/", catchAsync(ctrl.index));

router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  catchAsync(ctrl.createListing)
);

router.get("/:id", validateObjectId("id"), catchAsync(ctrl.showListing));

router.put(
  "/:id",
  validateObjectId("id"),
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  catchAsync(ctrl.updateListing)
);

router.delete(
  "/:id",
  validateObjectId("id"),
  isLoggedIn,
  isOwner,
  catchAsync(ctrl.deleteListing)
);

module.exports = router;
