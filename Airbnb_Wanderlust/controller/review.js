const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);//from listing[review]

    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    console.log("review created");

    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res) => {
    let {id,reviewId} = req.params;

    // is line se- listing ki id jis bi review ki id se match ho jaye ussse hm pull krna chahte h (delete krna chahte)
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    console.log("review was deleted");

    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}