const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { isManager } = require("../middleware/roleCheck");

// Get all employees (managers only)
router.get("/employees", auth, isManager, async (req, res) => {
  try {
    const employees = await User.find().select("-password").sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get own profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update own profile
router.put("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new employee (managers only)
router.post("/employees", auth, isManager, async (req, res) => {
  try {
    const { name, email, password, position, department } = req.body;

    // Check if employee already exists
    let employee = await User.findOne({ email });
    if (employee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Create new employee
    employee = new User({
      name,
      email,
      password,
      position,
      department,
      role: "normal", // Default role for new employees
    });

    await employee.save();
    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update employee (managers only)
router.put("/employees/:id", auth, isManager, async (req, res) => {
  try {
    const { name, email, position, department } = req.body;

    // Find and update employee
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          email,
          position,
          department,
        },
      },
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

// Delete employee (managers only)
router.delete("/employees/:id", auth, isManager, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Prevent deletion of managers
    if (employee.role === "manager") {
      return res
        .status(400)
        .json({ message: "Cannot delete manager accounts" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific employee (managers only)
router.get("/employees/:id", auth, isManager, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
