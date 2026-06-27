const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");

let userController = require("../controller/user.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,
    passport.authenticate("local", {failureRedirect : "/login",failureFlash : true}), userController.login);

router.get("/logout",userController.logout);

module.exports = router;
