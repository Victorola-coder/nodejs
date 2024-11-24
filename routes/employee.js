const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { isManager } = require("../middleware/roleCheck");

// Get all employees (managers only)
router.get("/list", auth, isManager, async (req, res) => {
  try {
    const employees = await User.find({ role: "normal" })
      .select("-password")
      .sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new employee (managers only)
router.post("/add", auth, isManager, async (req, res) => {
  try {
    const { email, password, name, position, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({
      email,
      password,
      name,
      position,
      department,
      role: "normal",
    });

    await user.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update employee (managers only)
router.put("/:id", auth, isManager, async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
