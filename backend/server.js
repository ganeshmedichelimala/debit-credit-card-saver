const express = require("express");
const connectDB = require("./config/db"); // Ensure this module exports a function to connect to DB
const authRoutes = require("./routes/authRoutes");
const cardRoutes = require("./routes/cardRoutes");
const friendRoutes = require("./routes/friendRoutes"); // Import the correct route file
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/cards", cardRoutes); // Card-related routes
app.use("/api/friends", friendRoutes); // Friend-related routes

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
