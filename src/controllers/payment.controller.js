const asyncHandler = require("../utils/async-handler");
const {
  createPayment,
  getPaymentById,
  verifyPayment,
  rejectPayment,
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

module.exports = {
  submitPayment,
  getPaymentByIdController,
  verifyPaymentController,
  rejectPaymentController,
};
