const Listing = require("../models/listing.model.js");
const ExpressError = require("../utils/ExpressError.js");
const { uploadImage, deleteImage } = require("../config/cloudinary.config.js");

// GET /api/listings  ->  supports ?category= and ?query= (combined search route).
module.exports.index = async (req, res) => {
  const { category, query } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (query && query.trim()) {
    const safe = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safe, "i");
    filter.$or = [{ title: regex }, { location: regex }, { country: regex }];
  }

  const listings = await Listing.find(filter).populate("owner", "username");
  res.json(listings);
};

// GET /api/listings/:id
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" },
    })
    .populate("owner", "username");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.json(listing);
};

// POST /api/listings  (auth + image upload)
module.exports.createListing = async (req, res) => {
  // Bug #1 fix: verify a file was actually uploaded before using it.
  if (!req.file) {
    throw new ExpressError(400, "Image is required");
  }

  const image = await uploadImage(req.file);

  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  newListing.image = image;
  await newListing.save();

  res.status(201).json({ message: "New listing created", listing: newListing });
};

// PUT /api/listings/:id  (auth + owner)
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  if (req.file) {
    const oldFilename = listing.image?.filename;
    listing.image = await uploadImage(req.file);
    await listing.save();
    // Clean up the replaced asset after the new one is safely saved, so a
    // failed save never leaves the listing without a valid image reference.
    if (oldFilename) deleteImage(oldFilename);
  }

  res.json({ message: "Listing updated", listing });
};

// DELETE /api/listings/:id  (auth + owner)  cascade-deletes reviews via model hook.
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  if (!deleted) {
    throw new ExpressError(404, "Listing not found");
  }
  // Best-effort cleanup; never let a Cloudinary hiccup turn a successful
  // delete into a 500 for the user.
  if (deleted.image?.filename) deleteImage(deleted.image.filename);
  res.json({ message: "Listing deleted" });
};
