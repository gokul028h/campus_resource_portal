const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const Rental = require("../models/Rental");
const Book = require("../models/Book");

const router = express.Router();

// Multer config: use memoryStorage to store the file in Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Profile Picture Upload Route
// POST /api/profile/upload/:email
router.post("/upload/:email", upload.single("profilePic"), async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    user.profilePic = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();

    // Convert image to base64 for immediate frontend preview (optional)
    const base64Image = user.profilePic.data.toString("base64");
    const contentType = user.profilePic.contentType;

    res.json({
      msg: "Profile picture uploaded successfully",
      profilePic: `data:${contentType};base64,${base64Image}`,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
