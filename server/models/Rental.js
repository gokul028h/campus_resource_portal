const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  totalAmount: Number,
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
});

module.exports = mongoose.model("Rental", rentalSchema);
