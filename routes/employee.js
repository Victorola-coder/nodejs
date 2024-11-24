const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

// Middleware to check if user is manager
const isManager = (req, res, next) => {
  if (req.session.userRole !== "manager") {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
};

// Get current user's profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update current user's profile
router.post("/profile/update", isAuthenticated, async (req, res) => {
  try {
    const { fullName, department, position } = req.body;
    await User.findByIdAndUpdate(req.session.userId, {
      fullName,
      department,
      position,
    });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all employees (manager only)
router.get("/list", isAuthenticated, isManager, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new employee (manager only)
router.post("/add", isAuthenticated, isManager, async (req, res) => {
  try {
    const { email, password, fullName, department, position } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new employee
    const employee = new User({
      email,
      password,
      fullName,
      department,
      position,
      role: "employee",
    });

    await employee.save();
    res.json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get employee by ID (manager only)
router.get("/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update employee (manager only)
router.post("/update/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    const { fullName, department, position } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      fullName,
      department,
      position,
    });
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete employee (manager only)
router.post("/delete/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
