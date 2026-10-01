const AsyncHandler = require("../utils/async-handler");
const { getAllStudents } = require("../services/student.service");

const getAllStudentsController = AsyncHandler(async (req, res) => {
  const validQuery = req.validQuery;
  const result = await getAllStudents(validQuery);
  res
    .status(200)
    .json({
      success: true,
      data: result,
      message: "All students fetched successfully",
    });
});

module.exports = {
  getAllStudentsController,
};
