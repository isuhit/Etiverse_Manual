const express = require("express");
const Router = express.Router();
const {
  submitPayment,
  getPaymentByIdController,
  verifyPaymentController,
  rejectPaymentController,
} = require("../controllers/payment.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  submitPaymentSchema,
  rejectPaymentSchema,
} = require("../validators/payment.validator");
const { validate } = require("../middleware/validate.middleware");

Router.post("/", validate(submitPaymentSchema), submitPayment);
Router.get("/:id", getPaymentByIdController);
Router.patch(
  "/:id/verify",
  protect,
  restrictTo("ADMIN"),
  verifyPaymentController,
);
Router.patch(
  "/:id/reject",
  protect,
  restrictTo("ADMIN"),
  validate(rejectPaymentSchema),
  rejectPaymentController,
);

module.exports = Router;
