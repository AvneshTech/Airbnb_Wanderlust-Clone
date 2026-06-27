// Seed script: ports the original sample listings. Run with `npm run seed`.
require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.model.js");
const User = require("../models/user.model.js");
const initData = require("./data.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function seedDB() {
  await mongoose.connect(dbUrl);
  console.log("Connected for seeding");

  // owner is now required, so ensure a seed user exists to own the sample listings.
  let owner = await User.findOne({ username: "seed-owner" });
  if (!owner) {
    owner = new User({ username: "seed-owner", email: "seed-owner@wanderlust.dev" });
    owner = await User.register(owner, "seedpassword123");
    console.log("Created seed owner user (username: seed-owner, password: seedpassword123)");
  }

  await Listing.deleteMany({});
  const docs = initData.data.map((obj) => ({ ...obj, owner: owner._id }));
  await Listing.insertMany(docs);
  console.log(`Inserted ${docs.length} listings`);

  await mongoose.connection.close();
  console.log("Done");
}

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
