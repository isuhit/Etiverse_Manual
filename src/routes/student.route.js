const Router = require("express").Router();
const {
  getAllStudentsController,
} = require("../controllers/student.controller");
const { validate } = require("../middleware/validate.middleware");
const { studentQuerySchema } = require("../validators/student.validator");
const {protect } = require("../middleware/auth.middleware");

Router.get(
  "/",
  protect,
  validate(studentQuerySchema, "query"),
  getAllStudentsController,
);

module.exports = Router;
