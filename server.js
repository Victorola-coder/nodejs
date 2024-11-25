require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Set view engine
app.set("view engine", "ejs");

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/employee", require("./routes/employee"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
