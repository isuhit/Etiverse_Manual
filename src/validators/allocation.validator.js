const Joi = require("joi");

const allocationCandidateSchema = Joi.object({
  regNumber: Joi.string().uppercase(),
  manualId: Joi.string().trim().hex().length(24).required(),
});

const createAllocationSchema = Joi.object({
  manualId: Joi.string().trim().hex().length(24).required().messages({
    "string.empty": "manualId is required",
    "any.required": "manualId is required",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.min": "Quantity cannot be negative",
    "number.integer": "Quantity allocated must be an integer",
    "any.required": "Quantity is required",
  }),
})
  .required()
  .messages({
    "object.base": "Request body must be a valid JSON object",
    "any.required": "Request body is required",
  });

const studentHistorySchema = Joi.object({
  student: Joi.string().trim().hex().length(24).required().messages({
    "string.empty": "student is required",
    "any.required": "student is required",
  }),
});

const allocationsQuerySchema = Joi.object({
  //Filtering
  collectionStatus: Joi.string()
    .trim()
    .uppercase()
    .valid("NOT_COLLECTED", "COLLECTED")
    .optional(),

  // Sorting and Pagination
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string().default("-createdAt"),
});

// Validates URL parameter for GET /students/:id
const allocationParamSchema = Joi.object({
  id: Joi.string().trim().hex().length(24).required().messages({
    "string.hex": "Student ID must be a valid 24-character hexadecimal ObjectId",
    "string.length": "Student ID must be exactly 24 characters long",
    "any.required": "Student ID parameter is required",
  }),
});

module.exports = {
  allocationCandidateSchema,
  createAllocationSchema,
  studentHistorySchema,
  allocationsQuerySchema,
  allocationParamSchema
};
