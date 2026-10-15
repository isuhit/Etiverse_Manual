const AsyncHandler = require("../utils/async-handler");
const {
  getAllStudents,
  getStudentByRegNumber, getStudentByIdService
} = require("../services/student.service");

const getAllStudentsController = AsyncHandler(async (req, res) => {
  const validQuery = req.validQuery;
  const result = await getAllStudents(validQuery);
  
  res.status(200).json({
    success: true,
    data: result,
    message: "All students fetched successfully",
  });
});

// GET /students/:id
const getStudentByIdController = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentData = await getStudentByIdService(id);

  res.status(200).json({
    status: "success",
    data: studentData,
  });
});

const getStudentByRegNumberController = AsyncHandler(async (req, res) => {
  const validQuery = req.validQuery;

  const student = await getStudentByRegNumber(validQuery);
  res.status(200).json({
    success: true,
    message: "Student details retrieved successfully",
    data: student,
  });
});

module.exports = {
  getAllStudentsController, getStudentByRegNumberController, getStudentByIdController
};
