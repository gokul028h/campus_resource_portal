const express = require("express");
const router = express.Router();
const Rental = require("../models/Rental");
const Book = require("../models/Book");

// Create a rental with manual UPI flow
router.post("/", async (req, res) => {
  try {
    const { bookId, renterId, startDate, endDate, totalAmount } = req.body;

    const book = await Book.findById(bookId).populate("owner");
    if (!book) return res.status(404).json({ error: "Book not found" });

    const rental = new Rental({
      book: bookId,
      renter: renterId,
      startDate,
      endDate,
      totalAmount,
      paymentStatus: "pending",
    });

    await rental.save();

    res.status(201).json({
      rental,
      sellerUPI: book.owner.upiId,
      message: "Please pay via UPI and wait for seller confirmation within 3 minutes.",
      expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes from now
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all rentals (for admin or history)
router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("book renter")
      .sort({ startDate: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seller confirms payment manually
router.post("/:id/confirm-payment", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    rental.paymentStatus = "paid";
    await rental.save();

    res.json({
      message: "Payment confirmed by seller",
      rental,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
