const express = require("express");
const Router = express.Router();
const { submitPayment, getPaymentByIdController } = require("../controllers/payment.controller");
const { submitPaymentSchema } = require("../validators/payment.validator");
const { validate } = require("../middleware/validate.middleware");

Router.post("/", validate(submitPaymentSchema), submitPayment);
Router.get("/:id", getPaymentByIdController);
module.exports = Router;
