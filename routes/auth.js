const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Login logic
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: "Login failed" });
  }
});

// Register logic
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.render("register", { error: "User already exists" });
    }

    // Create new user
    user = new User({
      email,
      password,
      fullName,
      role: role || "employee",
    });

    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.render("register", { error: "Registration failed" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
