const Student = require("../models/Student.model");
const AppError = require("../utils/AppError");

const getAllStudents = async (validQuery) => {
  const { regNumber, name, page, limit, sort } = validQuery;
  let skip = (page - 1) * limit;
  const filter = {};

  if (regNumber) {
    filter.regNumber = regNumber;
    skip = 0;
  }
  if (name) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: escapedName, $options: "i" };
    skip = 0;
  }

  const totalStudent = await Student.countDocuments(filter);
  const students = await Student.find(filter, { __v: 0 })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    students,
    total: totalStudent,
    page,
    limit,
    pages: Math.ceil(totalStudent / limit),
    size: students.length,
  };
};

// Fetch a single student by primary key ObjectId
const getStudentByIdService = async (studentId) => {
  const student = await Student.findById(studentId).select("-__v");

  if (!student) {
    throw new AppError("No student record found with that ID", 404);
  }

  return student;
};

const getStudentByRegNumber = async (validQuery) => {
  const { regNumber } = validQuery;

  const student = await Student.findOne({ regNumber });
  if (!student) throw new AppError("Student not found", 404);
  return {
    student: {
      _id: student._id,
      name: student.name,
      regNumber: student.regNumber,
    },
  };
};
module.exports = {
  getAllStudents,
  getStudentByRegNumber,
  getStudentByIdService,
};
