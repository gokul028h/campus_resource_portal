const PYQ = require("../models/pyqmodel");

const uploadPyq = async (req, res) => {
  try {
    const { subjectName, subjectCode, year, type, slot, date, email } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newPYQ = new PYQ({
      subjectName,
      subjectCode,
      year,
      type,
      slot,
      date,
      uploadedBy: email,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      }
    });

    await newPYQ.save();
    res.status(201).json({ message: "PYQ uploaded successfully" });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllPyqs = async (req, res) => {
  try {
    const pyqs = await PYQ.find().select("-image");
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch PYQs" });
  }
};

const getPyqImageById = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).json({ message: "PYQ not found" });

    res.set("Content-Type", pyq.image.contentType);
    res.send(pyq.image.data);
  } catch (err) {
    res.status(500).json({ message: "Image fetch failed" });
  }
};

module.exports = { uploadPyq, getAllPyqs, getPyqImageById };
