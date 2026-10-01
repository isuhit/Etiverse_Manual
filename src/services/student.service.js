const Student = require("../models/Student.model");

const getAllStudents = async (validQuery) => {
  const { regNumber, page, limit, sort } = validQuery;
  let skip = (page - 1) * limit;
  const filter = {};

  if (regNumber) {
    filter.regNumber = regNumber;
    skip = 0; // Reset skip to 0 if regNumber is provided
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

module.exports = {
  getAllStudents,
};
