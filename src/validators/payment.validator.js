const Joi = require("joi");

const submitPaymentSchema = Joi.object({
  regNumber: Joi.string().required().uppercase(),
  manual: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  transactionId: Joi.string().trim().required().uppercase(),
  evidenceUrl: Joi.string()
    .trim()
    .uri({ scheme: ["https"] })
    .pattern(/\.(png|jpg|jpeg|webp)(\?.*)?$/i)
    .required()
    .messages({
      "string.pattern.base":
        "Evidence URL must point to a valid image file (.png, .jpg, .jpeg, .webp)",
    }),
});

const rejectPaymentSchema = Joi.object({
  rejectionReason: Joi.string().trim().required(),
});

const studentPaymentHistorySchema = Joi.object({
  student: Joi.string().trim().hex().length(24).required().messages({
    "string.empty": "student is required",
    "any.required": "student is required",
  }),
});

const paymentsQuerySchema = Joi.object({
  //Filtering
  status: Joi.string().trim().uppercase().optional(),

  // Sorting and Pagination
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string(),
});

module.exports = {
  submitPaymentSchema,
  rejectPaymentSchema,
  studentPaymentHistorySchema,
  paymentsQuerySchema
};
