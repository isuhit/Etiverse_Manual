const mongoose = require("mongoose");

const allocationSchema = mongoose.Schema(
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
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectionStatus: {
      type: String,
      enum: ["NOT_COLLECTED", "COLLECTED"],
      default: "NOT_COLLECTED",
    },
    collectedAt: {
      type: Date,
      default: null,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);
allocationSchema.index({ student: 1, manual: 1 });
module.exports = mongoose.model("Allocation", allocationSchema);
