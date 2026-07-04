const Listing = require("../models/listing.model.js");
const ExpressError = require("../utils/ExpressError.js");
const { uploadImage } = require("../config/cloudinary.config.js");

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
  //   module.exports.createListing = async (req, res) => {
  //     console.log(req.file);

  //     const newListing = new Listing(req.body);

  //     newListing.owner = req.user._id;

  //     newListing.image = {
  //         url: "https://dummyimage.com/600x400",
  //         filename: "dummy"
  //     };

  //     await newListing.save();

  //     res.json(newListing);
  // };

  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  // console.log("USER:", req.user);
  // console.log("BODY:", req.body);
  // console.log("FILE:", req.file);
  // newListing.image = image;
  // await newListing.save();

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
    listing.image = await uploadImage(req.file);
    await listing.save();
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
  res.json({ message: "Listing deleted" });
};
