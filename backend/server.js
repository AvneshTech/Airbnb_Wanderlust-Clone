// Entry point: validate env, connect DB, then start listening.
require("dotenv").config();

const app = require("./app.js");
const connectDB = require("./config/db.js");

// Bug #4 fix: fail loud if any required env var is missing. Never fail open.
const REQUIRED_ENV = [
  "SECRET",
  "ATLASDB_URL",
  "CLOUD_NAME",
  "CLOUD_API_KEY",
  "CLOUD_API_SECRET",
  "OPENAI_API_KEY",
];

const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`FATAL: missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const PORT = process.env.PORT || 8080;

connectDB(process.env.ATLASDB_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("FATAL: could not connect to MongoDB", err);
    process.exit(1);
  });
