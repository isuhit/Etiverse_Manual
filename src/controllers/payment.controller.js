const asyncHandler = require("../utils/async-handler");
const {
  createPayment,
  getAllPaymentsService,
  getPaymentById,
  verifyPayment,
  rejectPayment,
  getStudentPaymentHistoryService,
} = require("../services/payment.service");

const submitPayment = asyncHandler(async (req, res, next) => {
  const { regNumber, manual, amount, transactionId, evidenceUrl } = req.body;

  const payment = await createPayment({
    regNumber,
    manual,
    amount,
    transactionId,
    evidenceUrl,
  });

  res.status(201).json({
    status: "success",
    data: payment,
    message: "Payment submitted successfully and is pending verification.",
  });
});

const getAllPaymentController = asyncHandler(async (req, res, next) => {
  const validQuery = req.validQuery;
  const payments = await getAllPaymentsService(validQuery);

  res.status(200).json({
    success: true,
    message: "Payments retrieved successfully",
    data: payments,
  });
});

const getPaymentByIdController = asyncHandler(async (req, res, next) => {
  const paymentId = req.params.id;
  const payment = await getPaymentById(paymentId);

  res.status(200).json({
    success: true,
    data: payment,
    message: "Payment retrieved successfully",
  });
});

const verifyPaymentController = asyncHandler(async (req, res, next) => {
  const paymentId = req.params.id;
  const userId = req.user.id;
  const updatedPayment = await verifyPayment(paymentId, userId);

  res.status(200).json({
    success: true,
    data: updatedPayment,
    message: "Payment verified successfully",
  });
});

const rejectPaymentController = asyncHandler(async (req, res, next) => {
  const paymentId = req.params.id;
  const userId = req.user.id;
  const { rejectionReason } = req.body;

  const updatedPayment = await rejectPayment(
    paymentId,
    userId,
    rejectionReason,
  );

  res.status(200).json({
    success: true,
    data: updatedPayment,
    message: "Payment rejected successfully",
  });
});

const getStudentPaymentHistoryController = asyncHandler(async (req, res, next) => {
  const student = req.validQuery.student;

  const payments = await getStudentPaymentHistoryService(student);

  res.status(200).json({
    success: true,
    message: "Student payment details retrieved successfully",
    data: payments,
  });
});

module.exports = {
  submitPayment,
  getAllPaymentController,
  getPaymentByIdController,
  verifyPaymentController,
  rejectPaymentController,
  getStudentPaymentHistoryController,
};
