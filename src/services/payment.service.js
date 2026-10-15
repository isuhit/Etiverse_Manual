const Payment = require("../models/Payment.model");
const Student = require("../models/Student.model");
const Manual = require("../models/Manual.model");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");
const AuditLog = require("../models/AuditLog.model");

const createPayment = async (paymentData) => {
  const { regNumber, manual, amount, transactionId, evidenceUrl } = paymentData;

  // Check if the student exists
  const student = await Student.findOne({ regNumber });
  if (!student) {
    throw new AppError(
      `Student with registration number ${regNumber} not found.`,
      404,
    );
  }

  // Check if the manual exists
  const manualDoc = await Manual.findById(manual);
  if (!manualDoc) {
    throw new AppError(`Manual with ID ${manual} not found.`, 404);
  }
  if (manualDoc.isActive == false) {
    throw new AppError(`Manual with ID ${manual} is not active.`, 409);
  }

  // Check if the amount is valid
  if (amount < manualDoc.price) {
    throw new AppError(
      `Payment amount ${amount} is less than the manual price ${manualDoc.price}.`,
      400,
    );
  }

  // Check if the transaction ID is unique
  const existingTransactionId = await Payment.findOne({ transactionId });
  if (existingTransactionId) {
    throw new AppError(
      `Payment with transaction ID ${transactionId} already exists.`,
      409,
    );
  }

  // Check if student has already made a payment for the same manual
  const existingPaymentForManual = await Payment.exists({
    student: student._id,
    manual: manualDoc._id,
    status: { $ne: "REJECTED" },
  });
  if (existingPaymentForManual) {
    throw new AppError(
      `Student with registration number ${regNumber} has already made a payment for this manual.`,
      409,
    );
  }

  // Create the payment
  const payment = await Payment.create({
    student: student._id,
    manual: manualDoc._id,
    amount,
    transactionId,
    evidenceUrl,
    status: "PENDING",
  });

  return {
    _id: payment._id,
    regNumber: student.regNumber,
    manualId: manualDoc._id,
    manual: manualDoc.title,
    courseCode: manualDoc.courseCode,
    amount: payment.amount,
    transactionId: payment.transactionId,
    evidenceUrl: payment.evidenceUrl,
    status: payment.status,
  };
};

const getAllPaymentsService = async (validQuery) => {
  const { status, page, limit, sort } = validQuery;
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;

  const [totalPayments, payments] = await Promise.all([
    Payment.countDocuments(filter),
    Payment.find(filter, { __v: 0 })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("manual", "title courseCode price")
      .populate("student", "name regNumber"),
  ]);

  return {
    payments,
    total: totalPayments,
    page,
    limit,
    pages: Math.ceil(totalPayments / limit),
    size: payments.length,
  };
};

const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("student", "regNumber name")
    .populate("manual", "title courseCode price")
    .lean();
  if (!payment) {
    throw new AppError(`Payment with ID ${paymentId} not found.`, 404);
  }
  return {
    _id: payment._id,
    student: payment.student,
    manual: payment.manual,
    amount: payment.amount,
    transactionId: payment.transactionId,
    evidenceUrl: payment.evidenceUrl,
    status: payment.status,
    verifiedBy: payment.verifiedBy,
    verifiedAt: payment.verifiedAt,
    rejectedBy: payment.rejectedBy,
    rejectedAt: payment.rejectedAt,
    rejectionReason: payment.rejectionReason,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
};

const verifyPayment = async (paymentId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: paymentId, status: "PENDING" },
      { status: "VERIFIED", verifiedBy: userId, verifiedAt: new Date() },
      { returnDocument: "after", session },
    )
      .populate("student", "regNumber")
      .populate("manual", "title")
      .lean();

    if (!updatedPayment) {
      throw new AppError(
        `Payment is not found or is not in PENDING status.`,
        409,
      );
    }
    await AuditLog.create(
      [
        {
          actor: userId,
          action: "PAYMENT_VERIFIED",
          entity: "Payment",
          entityId: paymentId,
          metadata: {
            studentRegNumber: updatedPayment.student.regNumber,
            manualTitle: updatedPayment.manual.title,
            amount: updatedPayment.amount,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return updatedPayment;
  } catch (err) {
    await session.abortTransaction();
    if (err instanceof AppError) {
      throw err;
    } else {
      console.error("Error verifying payment:", err);
      throw new AppError("Failed to verify payment.", 500);
    }
  } finally {
    await session.endSession();
  }
};

const rejectPayment = async (paymentId, userId, rejectionReason) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: paymentId, status: "PENDING" },
      {
        status: "REJECTED",
        rejectedBy: userId,
        rejectedAt: new Date(),
        rejectionReason,
      },
      { returnDocument: "after", session },
    )
      .populate("student", "regNumber")
      .populate("manual", "title")
      .lean();

    if (!updatedPayment) {
      throw new AppError(
        `Payment is not found or is not in PENDING status.`,
        409,
      );
    }

    await AuditLog.create(
      [
        {
          actor: userId,
          action: "PAYMENT_REJECTED",
          entity: "Payment",
          entityId: paymentId,
          metadata: {
            studentRegNumber: updatedPayment.student.regNumber,
            manualTitle: updatedPayment.manual.title,
            amount: updatedPayment.amount,
            rejectionReason,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return updatedPayment;
  } catch (err) {
    await session.abortTransaction();
    if (err instanceof AppError) {
      throw err;
    } else {
      console.error("Error rejecting payment:", err);
      throw new AppError("Failed to reject payment.", 500);
    }
  } finally {
    await session.endSession();
  }
};

const getStudentPaymentHistoryService = async (student) => {
  const payments = await Payment.find({ student }).populate(
    "manual",
    "title courseCode price",
  );

  if (!payments) throw new AppError("Student has no payments", 404);

  return payments;
};

module.exports = {
  createPayment,
  getAllPaymentsService,
  getPaymentById,
  verifyPayment,
  rejectPayment,
  getStudentPaymentHistoryService,
};
