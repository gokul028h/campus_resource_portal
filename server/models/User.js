const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  bookTitle: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true }, // Added googleId field
  authMethod: { type: String, enum: ['password', 'google'], default: 'google' }, // Track auth method
  profilePic: {
    data: Buffer,
    contentType: String,
  },
  rentalHistory: [historySchema],
  lendingHistory: [historySchema],
});

module.exports = mongoose.model("User", userSchema);