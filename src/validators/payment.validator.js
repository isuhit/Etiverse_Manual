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

module.exports = {
  submitPaymentSchema,
};
