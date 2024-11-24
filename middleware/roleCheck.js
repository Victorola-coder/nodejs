// Middleware to check if user is a manager
exports.isManager = (req, res, next) => {
  try {
    if (req.user && req.user.role === "manager") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Access denied. Manager role required." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if user is accessing their own profile
exports.isSelfOrManager = (req, res, next) => {
  try {
    if (
      req.user.role === "manager" ||
      req.user._id.toString() === req.params.id
    ) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Not authorized." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
