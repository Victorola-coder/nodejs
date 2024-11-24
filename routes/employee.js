const express = require("express");
const router = express.Router();
const { isAuthenticated, isManager } = require("../middleware/auth");
const User = require("../models/User");

// Get all employees (manager only)
router.get("/list", isAuthenticated, isManager, async (req, res) => {
  try {
    const employees = await User.find({ role: "normal" })
      .select("-password -__v")
      .sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get own profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update own profile
router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select("-password -__v");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new employee (manager only)
router.post("/add", isAuthenticated, isManager, async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      role: "normal",
    });
    await newUser.save();
    res.json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete employee (manager only)
router.delete("/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
