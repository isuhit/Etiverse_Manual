const {
  getAllocationCandidates,
  createAllocation,
} = require("../services/allocation.service");
const asyncHandler = require("../utils/async-handler");

const getAllocationCandidateController = asyncHandler(async (req, res) => {
  const manualId = req.validQuery.manualId;
  const candidates = await getAllocationCandidates(manualId);

  res.status(200).json({
    success: true,
    data: candidates,
    message: "Allocation candidates retrieved successfully",
  });
});

const createAllocationController = asyncHandler(async (req, res, next) => {
  const { manualId, quantity } = req.body;
  const userId = req.user.id;
  const allocations = await createAllocation(manualId, quantity, userId);

  res.status(201).json({
    success: true,
    data: allocations,
    message: "Allocation created successfully",
  });
});

module.exports = {
  getAllocationCandidateController,
  createAllocationController,
};
