const mongoose = require("mongoose");

async function connectDB(url) {
  await mongoose.connect(url);
  console.log("MongoDB connected");
  return mongoose.connection;
}

module.exports = connectDB;
