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

module.exports = {
  allocationCandidateSchema,
  createAllocationSchema,
};
