const Manual = require("../models/Manual.model");
const Payment = require("../models/Payment.model");
const Allocation = require("../models/Allocation.model");
const Student = require("../models/Student.model");
const AuditLog = require("../models/AuditLog.model");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const getAllocationCandidates = async (manualId) => {
  const manual = await Manual.findById(manualId)
    .select("quantityInStock")
    .lean();
  if (!manual) throw new AppError("Manual not found", 404);
  if (manual.quantityInStock <= 0) return [];

  const rawCandidates = await Payment.aggregate([
    {
      $match: {
        manual: new mongoose.Types.ObjectId(manualId),
        status: "VERIFIED",
      },
    },
    {
      $lookup: {
        from: "allocations",
        localField: "_id",
        foreignField: "payment",
        as: "allocation",
      },
    },
    {
      $match: {
        allocation: { $size: 0 },
      },
    },
    {
      $sort: {
        createdAt: 1,
        _id: 1,
      },
    },
    {
      $limit: manual.quantityInStock,
    },
    {
      $project: {
        allocation: 0,
      },
    },
  ]);

  const populatedCandidates = await Payment.populate(rawCandidates, [
    {
      path: "student",
      select: "name regNumber",
    },
    {
      path: "manual",
      select: "courseCode price",
    },
  ]);
  const candidates = populatedCandidates.map((candidate) => ({
    id: candidate._id,
    amount: candidate.amount,
    createdAt: candidate.createdAt,
    student: candidate.student,
    manual: candidate.manual,
  }));
  return candidates;
};

const createAllocation = async (manualId, quantity, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Validate manual existence and stock
    const manual = await Manual.findById(manualId).session(session);
    if (!manual) throw new AppError("Manual not found", 404);

    // Find eligible payments for allocation
    const eligiblePayments = await Payment.aggregate([
      {
        $match: {
          manual: new mongoose.Types.ObjectId(manualId),
          status: "VERIFIED",
        },
      },
      {
        $lookup: {
          from: "allocations",
          localField: "_id",
          foreignField: "payment",
          as: "allocation",
        },
      },
      {
        $match: {
          allocation: { $size: 0 },
        },
      },
      {
        $sort: {
          createdAt: 1,
          _id: 1,
        },
      },
      {
        $limit: quantity,
      },
      {
        $project: {
          allocation: 0,
        },
      },
    ]).session(session);

    if (eligiblePayments.length < quantity) {
      throw new AppError(
        `Not enough eligible payments for allocation. Requested: ${quantity}, Available: ${eligiblePayments.length}`,
        400,
      );
    }

    // Check if there is sufficient stock for the requested quantity
    const sufficientStock = await Manual.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(manualId),
        quantityInStock: { $gte: quantity },
      },
      { $inc: { quantityInStock: -quantity } },
      { returnDocument: "after", session },
    );
    if (!sufficientStock)
      throw new AppError("Insufficient stock for allocation", 400);

    // Create allocation records for the eligible payments
    const allocationCandidates = eligiblePayments.map((payment) => ({
      student: payment.student,
      manual: payment.manual,
      payment: payment._id,
      allocatedBy: userId,
    }));

    const createdAllocations = await Allocation.insertMany(
      allocationCandidates,
      {
        session,
      },
    );

    //Create audit log entry for the allocation
    await AuditLog.create(
      [
        {
          actor: userId,
          action: "ALLOCATION_CREATED",
          entity: "Allocation",
          entityId: createdAllocations[0]._id,
          metadata: {
            manualId,
            quantity,
            allocationIds: createdAllocations.map((a) => a._id),
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return createdAllocations;
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    if (err instanceof AppError) throw err;
    console.error("Error allocating manual", err);
    throw err;
  } finally {
    await session.endSession();
  }
};

const collectManual = async (allocationId, userId) => {
  // 1. Fetch record and run guard checks
  const allocation = await Allocation.findById(allocationId).lean();
  if (!allocation) throw new AppError("Allocation does not exist", 404);
  if (allocation.collectionStatus == "COLLECTED")
    throw new AppError("Manual already collected", 409);

  // 2. Start transaction for multi-document operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedCollection = await Allocation.findOneAndUpdate(
      {
        _id: allocationId,
      },
      {
        collectionStatus: "COLLECTED",
        collectedBy: userId,
        collectedAt: new Date(),
      },
      { returnDocument: "after", session },
    ).populate([
      {
        path: "student",
        select: "regNumber name",
      },
      { path: "manual", select: "courseCode" },
    ]);

    if (!updatedCollection)
      throw new AppError("Couldn't update collection", 400);

    // 3. Write Audit Log
    await AuditLog.create(
      [
        {
          actor: userId,
          action: "MANUAL_COLLECTED",
          entity: "Allocation",
          entityId: allocationId,
          metadata: {
            manualId: updatedCollection.manual,
            name: updatedCollection.student.name,
            regNumber: updatedCollection.student.regNumber,
            courseCode: updatedCollection.manual.courseCode,
          },
        },
      ],
      { session },
    );
    await session.commitTransaction();
    return updatedCollection;
  } catch (err) {
    if (session.inTransaction) await session.abortTransaction();
    if (err instanceof AppError) throw err;
    throw err;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getAllocationCandidates,
  createAllocation,
  collectManual,
};
