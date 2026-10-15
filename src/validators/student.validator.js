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
  name: Joi.string().trim().optional(),

  // Pagination & Sorting
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string()
    .valid("name", "-name", "createdAt", "-createdAt", "regNumber")
    .default("regNumber"),
});

const studentLookupSchema = Joi.object({
  regNumber: Joi.string()
    .trim()
    .uppercase()
    .required()
    .pattern(/^\d{2}\/[A-Z]{2}\/[A-Z]{2}\/\d+$/)
    .messages({
      "string.pattern.base":
        "Registration number format must be '25/CO/IS/007'",
      "any.required": "Registration number is required for lookup",
      "string.empty": "Registration number cannot be empty",
    }),
});

// Validates URL parameter for GET /students/:id
const studentIdParamSchema = Joi.object({
  id: Joi.string().trim().hex().length(24).required().messages({
    "string.hex": "Student ID must be a valid 24-character hexadecimal ObjectId",
    "string.length": "Student ID must be exactly 24 characters long",
    "any.required": "Student ID parameter is required",
  }),
});

module.exports = { studentQuerySchema, studentLookupSchema, studentIdParamSchema };
