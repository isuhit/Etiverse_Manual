const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
      enum: ['Manual','Payment','Allocation','User'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entity",
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

auditLogSchema.index({ entity: 1 , entityId: 1});

module.exports = mongoose.model("AuditLog", auditLogSchema);
