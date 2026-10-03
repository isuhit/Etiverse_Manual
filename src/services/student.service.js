const Student = require("../models/Student.model");

const getAllStudents = async (validQuery) => {
  const { regNumber, page, limit, sort } = validQuery;
  let skip = (page - 1) * limit;
  const filter = {};

  if (regNumber) {
    filter.regNumber = regNumber;
<<<<<<< HEAD
    skip = 0;
=======
    skip = 0; // Reset skip to 0 if regNumber is provided
>>>>>>> f6208a6aa99d9bd6cd53abe313e459bc57dc58fa
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
