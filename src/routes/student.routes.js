const Router = require("express").Router();
const {
  getAllStudentsController,
  getStudentByRegNumberController, getStudentByIdController
} = require("../controllers/student.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  studentQuerySchema,
  studentLookupSchema,studentIdParamSchema
} = require("../validators/student.validator");
const { protect } = require("../middleware/auth.middleware");

Router.get(
  "/",
  protect,
  validate(studentQuerySchema, "query"),
  getAllStudentsController,
);
Router.get(
  "/lookup",
  validate(studentLookupSchema, "query"),
  getStudentByRegNumberController,
);
// GET /students/:id
Router.get(
  "/:id",protect,
  validate(studentIdParamSchema, "params"),
  getStudentByIdController
);



module.exports = Router;
