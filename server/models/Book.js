const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  description: String,
  upiId: String,
  lenderEmail: String,
});

module.exports = mongoose.model("Book", bookSchema);
