const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Book = require("../models/Book");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 16923938291.jpg
  },
});

const upload = multer({ storage });

// Add book route with image
router.post("/add", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, author, description, price, lenderEmail } = req.body;
    const newBook = new Book({
      title,
      author,
      description,
      price,
      lenderEmail,
      coverImage: req.file.filename, // Save filename in DB
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
