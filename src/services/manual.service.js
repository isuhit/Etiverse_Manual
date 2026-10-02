const Manual = require("../models/Manual.model");
const AppError = require("../utils/AppError");
const AuditLog = require("../models/AuditLog.model");

const createManual = async (manualData) => {
  const {
    title,
    courseCode,
    courseDescription,
    price,
    quantityObtained,
    isActive,
    userId,
  } = manualData;

  // Check if a manual with the same courseCode already exists
  const existingManual = await Manual.findOne({
    courseCode: courseCode.toUpperCase(),
  });
  if (existingManual) {
    throw new AppError(
      `A manual with course code ${courseCode} already exists.`,
      409,
    );
  }

  // Create a new manual instance
  const manual = await Manual.create({
    title,
    courseCode: courseCode.toUpperCase(), // Normalize to uppercase
    courseDescription,
    price,
    quantityObtained,
    quantityInStock: quantityObtained,
    isActive,
  });

  try {
    await AuditLog.create({
      actor: userId,
      action: "MANUAL_CREATED",
      entity: "Manual",
      entityId: manual._id,
      metadata: {
        courseCode: manual.courseCode,
        price: manual.price,
        quantityObtained: manual.quantityObtained,
      },
    });
  } catch (error) {
    console.error("Failed to log audit entry:", error);
  }

  return manual;
};

const getAllManual = async () => {
  const manual = await Manual.find().sort({
    courseCode: 1,
  });
  return manual;
};

const getManualById = async (manualId) => {
  const manual = await Manual.findById(manualId);
  if (!manual) {
    throw new AppError(`Manual with ID ${manualId} not found`, 404);
  }

  return manual;
};

const updateManual = async (manualId, updateData, userId) => {
  const manual = await Manual.findById(manualId);
  if (!manual) {
    throw new AppError(`Manual with ID ${manualId} not found`, 404);
  }
const { title,courseDescription, courseCode, price,  addStock, isActive} = updateData;
 
if (addStock !== undefined) {
  manual.quantityObtained += addStock;
  manual.quantityInStock += addStock;
}

Object.assign(manual, {
  title: title !== undefined ? title : manual.title,
  courseDescription: courseDescription !== undefined ? courseDescription : manual.courseDescription,
  courseCode: courseCode !== undefined ? courseCode.toUpperCase() : manual.courseCode,
  price: price !== undefined ? price : manual.price,
  isActive: isActive !== undefined ? isActive : manual.isActive,
});

  await manual.save();

  try {
    if(addStock)
    await AuditLog.create({
      actor: userId,
      action: "MANUAL_UPDATED",
      entity: "Manual",
      entityId: manual._id,
      metadata: {
        addStock,
        courseCode: manual.courseCode,
        price: manual.price,
        quantityObtained: manual.quantityObtained,
      },
    });
  } catch (error) {
    console.error("Failed to log audit entry:", error);
  }

  return manual;
};

module.exports = { createManual, getAllManual, getManualById, updateManual };
