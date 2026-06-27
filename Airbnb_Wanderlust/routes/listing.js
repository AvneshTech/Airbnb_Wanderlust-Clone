const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const { index, renderNewForm, showListing, createListing, renderEditForm, deleteListing, updateListing, Privacy, TermsConditions, filterByCategory, filterRoute} = require("../controller/listing.js");

// Privacy&Policy Routes 
router.get("/privacy" , Privacy)

// Terms&Conditions Routes
router.get("/terms" ,TermsConditions)


// ---index route-------
router.get("/" ,wrapAsync(index));

// Filter listings by category
router.get("/category/:category", wrapAsync(filterByCategory));

//New route
router.get("/new",isLoggedIn ,wrapAsync(renderNewForm));

// Search listings (works for all types of data)
router.get("/search", wrapAsync(filterRoute) );


// Show route
router.get("/:id",wrapAsync(showListing));

// create route
router.post("/",isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(createListing));
// router.post("/", upload.single('listing[image]'), (req,res) => {
//     res.send(req.file);
// })

// edit route
router.get("/:id/edit",isLoggedIn ,isOwner,wrapAsync(renderEditForm));

// update route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(updateListing));

// delete route
router.delete("/:id",isLoggedIn ,isOwner, wrapAsync(deleteListing));


module.exports = router;