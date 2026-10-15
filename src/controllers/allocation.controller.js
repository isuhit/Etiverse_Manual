const {
  getAllocationCandidates,
  createAllocation,
  collectManual,
  getStudentAllocationService,
  getAllAllocationService,
  getAllocationByIdService,
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

const collectManualController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const allocationId = req.params.id;
  const collectedManual = await collectManual(allocationId, userId);

  res.status(201).json({
    success: true,
    data: collectedManual,
    message: "Manual collected successfully",
  });
});

const getStudentAllocationStatusController = asyncHandler(async (req, res) => {
  const student = req.validQuery.student;

  const allocationData = await getStudentAllocationService(student);

  res.status(200).json({
    status: "success",
    message: "Student allocation status retrieved successfully",
    data: allocationData,
  });
});

const getAllAllocationsController = asyncHandler(async (req, res) => {
  const validQuery = req.validQuery;
  const allocations = await getAllAllocationService(validQuery);

  res
    .status(200)
    .json({
      success: true,
      message: "Allocations retrieved successfully",
      data: allocations,
    });
});

const getAllocationByIdController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const allocation = await getAllocationByIdService(id);

  res.status(200).json({
    success: true,
    message: "Allocation retrieved successfully",
    data: allocation,
  });
});

module.exports = {
  getAllocationCandidateController,
  createAllocationController,
  collectManualController,
  getStudentAllocationStatusController,
  getAllAllocationsController,
  getAllocationByIdController,
};
