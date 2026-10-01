const Joi = require("joi");

const studentQuerySchema = Joi.object({
  // Filtering (Optional search filter)
  regNumber: Joi.string()
    .trim()
    .uppercase()
    .optional()
    .pattern(/^\d{2}\/[A-Z]{2}\/[A-Z]{2}\/\d+$/)
    .messages({
      "string.pattern.base":
        "Registration number format must be '25/CO/IS/007'",
    }),

  // Pagination & Sorting
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string()
    .valid("name", "-name", "createdAt", "-createdAt")
    .default("-createdAt"),
});

module.exports = { studentQuerySchema };
