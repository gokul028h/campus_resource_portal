const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Your React port
  credentials: true
}));;
app.use(express.json()); // For parsing JSON bodies
app.use("/uploads", express.static("uploads")); // To serve uploaded images

// Routes
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const pyqRoutes = require("./routes/pyqRoutes");

app.use("/api/pyqs", pyqRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/profile", profileRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("📚 Book Rental Backend is Running!");
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
