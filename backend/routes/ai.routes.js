const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/auth.middleware.js");
const { chatLimiter } = require("../middleware/rateLimit.middleware.js");
const ctrl = require("../controllers/ai.controller.js");

// /api/chat
router.get("/history", isLoggedIn, ctrl.history);
router.post("/", isLoggedIn, chatLimiter, ctrl.sendMessage);
router.post("/clear", isLoggedIn, ctrl.clear);

module.exports = router;
