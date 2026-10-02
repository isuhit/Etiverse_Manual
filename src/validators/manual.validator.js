const Joi = require('joi');

const manualSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  courseCode: Joi.string().trim().uppercase().required().messages({
    'string.empty': 'Course code is required',
    'any.required': 'Course code is required',
  }),
  courseDescription: Joi.string().trim().required().messages({
    'string.empty': 'Course description is required',
    'any.required': 'Course description is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  quantityObtained: Joi.number().integer().min(0).default(0).messages({
    'number.min': 'Quantity obtained cannot be negative',
    'number.integer': 'Quantity obtained must be an integer',
  }),
  isActive: Joi.boolean().default(true),
});

const patchManualSchema = Joi.object({
  title: Joi.string().trim().optional(),
  courseCode: Joi.string().trim().uppercase().optional(),
  courseDescription: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional().messages({
    'number.min': 'Price cannot be negative',
  }),
  addStock: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Quantity to add cannot be less than 1',
    'number.integer': 'Quantity to add must be an integer',
  }),
  isActive: Joi.boolean().optional(),
});

module.exports = { manualSchema, patchManualSchema };