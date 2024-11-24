const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

// Manager authorization middleware
const isManager = (req, res, next) => {
  if (req.session.userRole !== "manager") {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
};

// Sanitize user input
const sanitizeInput = (obj) => {
  const sanitized = {};
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      sanitized[key] = obj[key].trim();
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

// Get current user's profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select(
      "-password -__v"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update current user's profile
router.post("/profile/update", isAuthenticated, async (req, res) => {
  try {
    const updates = sanitizeInput({
      fullName: req.body.fullName,
      department: req.body.department,
      position: req.body.position,
    });

    // Validate required fields
    if (!updates.fullName) {
      return res.status(400).json({ error: "Full name is required" });
    }

    const user = await User.findByIdAndUpdate(req.session.userId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all employees (manager only)
router.get("/list", isAuthenticated, isManager, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .select("-password -__v")
      .sort({ fullName: 1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new employee (manager only)
router.post("/add", isAuthenticated, isManager, async (req, res) => {
  try {
    const employeeData = sanitizeInput({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      department: req.body.department,
      position: req.body.position,
    });

    // Validate required fields
    if (
      !employeeData.email ||
      !employeeData.password ||
      !employeeData.fullName
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: employeeData.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const employee = new User({
      ...employeeData,
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
