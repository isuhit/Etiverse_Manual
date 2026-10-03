const asyncHandler = require("../utils/async-handler");
const {
  createPayment,
  getPaymentById,
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

module.exports = {
  submitPayment,
  getPaymentByIdController,
};
