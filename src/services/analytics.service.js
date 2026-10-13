const Payments = require("../models/Payment.model");
const Manual = require("../models/Manual.model");

const getAnalyticsService = async () => {
  // 1. Fetch Global Payment Metrics
  const fetchedPaymentSummary = await Payments.aggregate([
    {
      $group: {
        _id: null,
        totalSubmitted: { $sum: 1 },
        totalVerified: {
          $sum: { $cond: [{ $eq: ["$status", "VERIFIED"] }, 1, 0] },
        },
        totalRejected: {
          $sum: { $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0] },
        },
        totalAmountCollected: {
          $sum: { $cond: [{ $eq: ["$status", "VERIFIED"] }, "$amount", 0] },
        },
      },
    },
  ]);

  // default standard zeroed-out defaults
  const defaultPaymentStats = {
    totalSubmitted: 0,
    totalVerified: 0,
    totalRejected: 0,
    totalAmountCollected: 0,
  };

  const { _id, ...stats } = fetchedPaymentSummary[0] || {};
  const paymentStats = { ...defaultPaymentStats, ...stats };

  // 2. Fetch Per-Manual Allocation Metrics
  const byManual = await Manual.aggregate([
    {
      $lookup: {
        from: "allocations",
        localField: "_id",
        foreignField: "manual",
        as: "allocation",
      },
    },
    {
      $addFields: {
        totalAllocated: { $size: "$allocation" },
        totalCollected: {
          $size: {
            $filter: {
              input: "$allocation",
              as: "alloc",
              cond: { $eq: ["$$alloc.collectionStatus", "COLLECTED"] },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        courseCode: 1,
        title: 1,
        price: 1,
        quantityObtained: 1,
        quantityInStock: 1,
        totalAllocated: 1,
        totalCollected: 1,
      },
    },
  ]);

  // 3. Derive Global Inventory Summary from Manual Array
  const inventorySummary = byManual.reduce(
    (acc, manual) => {
      ((acc.totalObtained += manual.quantityObtained || 0),
        (acc.totalInStock += manual.quantityInStock || 0),
        (acc.totalAllocated += manual.totalAllocated || 0),
        (acc.totalCollected += manual.totalCollected || 0));
      return acc;
    },
    {
      totalObtained: 0,
      totalInStock: 0,
      totalAllocated: 0,
      totalCollected: 0,
    },
  );

  return {
    summary: {
      payment: paymentStats,
      inventory: inventorySummary,
    },
    perManual: byManual,
  };
};

module.exports = { getAnalyticsService };
