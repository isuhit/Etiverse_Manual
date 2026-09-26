const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    manual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manual",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    evidenceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ manual: 1, status: 1, createdAt: 1 });
module.exports = mongoose.model("Payment", paymentSchema);
