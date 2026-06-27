const express = require("express");
const router = express.Router();
const passport = require("passport");

const catchAsync = require("../utils/catchAsync.js");
const { authLimiter } = require("../middleware/rateLimit.middleware.js");
const { validateSignup } = require("../middleware/validate.middleware.js");
const ctrl = require("../controllers/user.controller.js");

// /api/auth
router.post("/signup", authLimiter, validateSignup, catchAsync(ctrl.signup));

router.post(
  "/login",
  authLimiter,
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: (info && info.message) || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        next();
      });
    })(req, res, next);
  },
  ctrl.login
);

router.post("/logout", ctrl.logout);
router.get("/me", ctrl.me);

module.exports = router;
