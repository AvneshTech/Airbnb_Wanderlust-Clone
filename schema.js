const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().allow("",null),
        country: Joi.string().required(),
        category: Joi.string()
          .valid("beach", "mountain", "city", "farms", "snow", "lakes", "camping", "boats", "rooms", "trending")
          .required()
    }).required(),
});
// module.exports = listingSchema;     

// review schema
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
});
// module.exports = reviewSchema;


// note-for exporting both directly as object then i app.js also we import in obj form