// Bug #5 fix: throttle auth and the paid OpenAI-backed chat endpoint.
const rateLimit = require("express-rate-limit");

// Strict: 5 requests / 15 min for login & signup.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});

// Chat: 20 requests / hour.
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Chat rate limit reached. Please try again later." },
});

module.exports = { authLimiter, chatLimiter };
