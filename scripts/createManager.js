const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createInitialManager() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const manager = new User({
      email: "manager@company.com",
      password: "manager123",
      fullName: "System Manager",
      role: "manager",
    });

    await manager.save();
    console.log("Manager account created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating manager:", error);
    process.exit(1);
  }
}

createInitialManager();
