const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login");
    }
    req.user = user;
    next();
  } catch (error) {
    res.redirect("/login");
  }
};

exports.isManager = async (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    next();
  } else {
    res
      .status(403)
      .render("error", { message: "Access denied. Managers only." });
  }
};
