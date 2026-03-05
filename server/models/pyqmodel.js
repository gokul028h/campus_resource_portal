const mongoose = require("mongoose");

const pyqSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: {
    type: String,
    required: true,
    match: /^[A-Za-z]{4}\d{3}$/  // 4 letters + 3 digits
  },
  year: { type: Number, required: true },
  type: {
    type: String,
    enum: ["CAT1", "CAT2", "FAT"],
    required: true
  },
  slot: { type: String, required: true },
  date: { type: Date, required: true },
  image: { data: Buffer, contentType: String },
  uploadedBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("PYQ", pyqSchema);
