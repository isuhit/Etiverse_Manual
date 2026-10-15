const Router = require("express").Router();
const {
  getAllocationCandidateController,
  createAllocationController,
  collectManualController,
  getStudentAllocationStatusController,
  getAllAllocationsController,
  getAllocationByIdController
} = require("../controllers/allocation.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  allocationCandidateSchema,
  createAllocationSchema,
  studentHistorySchema,
  allocationsQuerySchema,allocationParamSchema
} = require("../validators/allocation.validator");
const { protect, restrictTo } = require("../middleware/auth.middleware");

Router.get(
  "/student-status",
  validate(studentHistorySchema, "query"),
  getStudentAllocationStatusController,
);

Router.use(protect, restrictTo("ADMIN", "ASSISTANT"));
Router.get("/", validate(allocationsQuerySchema, "query"), getAllAllocationsController);
Router.get("/:id",validate(allocationParamSchema, "params"), getAllocationByIdController)
Router.get(
  "/candidates",
  validate(allocationCandidateSchema, "query"),
  getAllocationCandidateController,
);
Router.post(
  "/",
  validate(createAllocationSchema, "body"),
  createAllocationController,
);
Router.patch("/:id/collect", collectManualController);

module.exports = Router;
