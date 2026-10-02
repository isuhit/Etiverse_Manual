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
      uppercase: true, 
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
    quantityObtained: {
      type: Number,
      required: true,
      min: [0, "Quantity obtained cannot be negative"],
      default: 0,
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0, 
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Manual", manualSchema);
