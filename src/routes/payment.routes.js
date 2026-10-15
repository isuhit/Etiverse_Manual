const express = require("express");
const Router = express.Router();
const {
  submitPayment,
  getAllPaymentController,
  getPaymentByIdController,
  verifyPaymentController,
  rejectPaymentController,
  getStudentPaymentHistoryController,
} = require("../controllers/payment.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  submitPaymentSchema,
  rejectPaymentSchema,
  studentPaymentHistorySchema,
  paymentsQuerySchema,
} = require("../validators/payment.validator");
const { validate } = require("../middleware/validate.middleware");

// Public route - no auth middleware needed
Router.get(
  "/student-history",
  validate(studentPaymentHistorySchema, "query"),
  getStudentPaymentHistoryController,
);
Router.post("/", validate(submitPaymentSchema), submitPayment);

// Private Route
Router.get(
  "/",
  protect,
  validate(paymentsQuerySchema, "query"),
  getAllPaymentController,
);
Router.get("/:id",protect, getPaymentByIdController);
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
