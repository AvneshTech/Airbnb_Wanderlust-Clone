const User = require("../models/user.model.js");

// Strip sensitive fields before returning a user.
const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
});

// POST /api/auth/signup
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registered = await User.register(newUser, password);

    req.login(registered, (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "Welcome to WanderLust", user: publicUser(registered) });
    });
  } catch (err) {
    // Duplicate username etc. -> clean 400 with a singular message string (bug #9).
    return res.status(400).json({ message: err.message });
  }
};

// POST /api/auth/login  (passport.authenticate runs before this)
module.exports.login = (req, res) => {
  res.json({ message: "Welcome back to WanderLust", user: publicUser(req.user) });
};

// POST /api/auth/logout  (bug #6 fix: POST, not GET)
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "You are logged out" });
  });
};

// GET /api/auth/me  -> used by the frontend on load to restore auth state.
module.exports.me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: publicUser(req.user) });
};
