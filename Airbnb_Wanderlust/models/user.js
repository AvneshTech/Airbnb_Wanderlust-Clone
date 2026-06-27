const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
    // passportLocalMongoose add username and pwd automatically in db so no need to define that
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);
module.exports = User; 