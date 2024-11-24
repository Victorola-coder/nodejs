const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated, isManager } = require("../middleware/auth");

// Get all employees (managers only)
router.get("/list", isAuthenticated, isManager, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.render("employeeList", { employees });
  } catch (error) {
    res.render("error", { message: "Failed to fetch employees" });
  }
});

// View profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.render("profile", { user });
  } catch (error) {
    res.render("error", { message: "Failed to fetch profile" });
  }
});

// Update profile
router.post("/profile/update", isAuthenticated, async (req, res) => {
  try {
    const { fullName, department, position } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      fullName,
      department,
      position,
    });
    res.redirect("/employee/profile");
  } catch (error) {
    res.render("error", { message: "Failed to update profile" });
  }
});

// Manager routes
router.post("/add", isAuthenticated, isManager, async (req, res) => {
  try {
    const { email, password, fullName, department, position } = req.body;
    const newEmployee = new User({
      email,
      password,
      fullName,
      department,
      position,
      role: "employee",
    });
    await newEmployee.save();
    res.redirect("/employee/list");
  } catch (error) {
    res.render("error", { message: "Failed to add employee" });
  }
});

router.post("/delete/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/employee/list");
  } catch (error) {
    res.render("error", { message: "Failed to delete employee" });
  }
});

module.exports = router;
