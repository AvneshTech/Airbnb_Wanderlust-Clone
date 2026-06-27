const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  // passport-local-mongoose adds username, hash and salt fields automatically.
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
