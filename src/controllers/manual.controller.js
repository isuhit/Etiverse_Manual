const {
  createManual,
  getAllManual,
  getManualById,
  updateManual,
} = require("../services/manual.service");
const AsyncHandler = require("../utils/async-handler");

const createManualController = AsyncHandler(async (req, res, next) => {
  const {
    title,
    courseCode,
    courseDescription,
    price,
    quantityObtained,
    isActive,
  } = req.body;
  const userId = req.user.id; // Assuming req.user is populated by the authentication middleware

  const manual = await createManual({
    title,
    courseCode,
    courseDescription,
    price,
    quantityObtained,
    isActive,
    userId,
  });

  res.status(201).json({
    success: true,
    data: manual,
    message: "Manual created successfully",
  });
});

const getAllManualController = AsyncHandler(async (req, res, next) => {
  const manual = await getAllManual();

  res.status(200).json({
    success: true,
    data: manual,
    message: "Manuals retrieved successfully",
  });
});

const getManualByIdController = AsyncHandler(async (req, res, next) => {
  const manualId = req.params.id;
  const manual = await getManualById(manualId);

  res.status(200).json({
    success: true,
    data: manual,
    message: "Manual retrieved successfully",
  });
});

const updateManualController = AsyncHandler(async (req, res, next) => {
  const manualId = req.params.id;
  const manualData = req.body;
  const userId = req.user.id; 
  
  const updatedManual = await updateManual(manualId, manualData, userId);

  res.status(200).json({
    success: true,
    data: updatedManual,
    message: "Manual updated successfully",
  });
});

module.exports = {
  createManualController,
  getAllManualController,
  getManualByIdController,
  updateManualController,
};
