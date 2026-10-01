const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().trim().required().lowercase().messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters and contain both letters and numbers",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    })
    .required(),
});


const createUserSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  username: Joi.string().trim().lowercase().required().messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters and contain both letters and numbers",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  role: Joi.string()
    .required()
    .valid("ADMIN", "ASSISTANT")
    .messages({
      "any.only": "Role must be either ADMIN or ASSISTANT",
      "string.empty": "Role is required",
      "any.required": "Role is required",
    }),
  isActive: Joi.boolean().default(true),
});

module.exports = { loginSchema, createUserSchema };
