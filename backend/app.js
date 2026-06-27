// Express app configuration only. No app.listen here (that lives in server.js).
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");

const User = require("./models/user.model.js");
const { notFound, errorHandler } = require("./middleware/error.middleware.js");

const listingRoutes = require("./routes/listing.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const userRoutes = require("./routes/user.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const aiRoutes = require("./routes/ai.routes.js");

const app = express();

// Body parsers (express built-ins replace body-parser; bug #11).
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS actually configured this time, with credentials + an explicit origin (bug #11).
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Sessions backed by Mongo. Secret is guaranteed present (validated at boot in server.js).
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  ttl: 7 * 24 * 60 * 60,
});
store.on("error", (err) => console.error("SESSION STORE ERROR", err));

app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Passport (session-based local strategy).
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Health check.
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// API routes.
app.use("/api/listings", listingRoutes);
app.use("/api/listings/:listingId/reviews", reviewRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", aiRoutes);

// 404 + central error handler (JSON).
app.use(notFound);
app.use(errorHandler);

module.exports = app;
