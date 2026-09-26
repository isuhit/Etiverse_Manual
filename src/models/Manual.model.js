const mongoose = require("mongoose");

const manualSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Normalizes course codes (e.g., 'inf121' -> 'INF121')
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0, // Tracks total physical stock in hand
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manual", manualSchema);