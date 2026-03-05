const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  uploadPyq,
  getAllPyqs,
  getPyqImageById
} = require("../controllers/pyqController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload PYQ
router.post("/upload", upload.single("image"), uploadPyq);

// Get all metadata
router.get("/", getAllPyqs);

// Get image by ID
router.get("/image/:id", getPyqImageById);

module.exports = router;
