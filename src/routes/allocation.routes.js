const Router = require("express").Router();
const {
  getAllocationCandidateController,
  createAllocationController,
  collectManualController,
} = require("../controllers/allocation.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  allocationCandidateSchema,createAllocationSchema
} = require("../validators/allocation.validator");
const { protect, restrictTo } = require("../middleware/auth.middleware");

Router.use(protect, restrictTo("ADMIN", "ASSISTANT"));

Router.get(
  "/candidates",
  validate(allocationCandidateSchema, "query"),
  getAllocationCandidateController,
);
Router.post("/", validate(createAllocationSchema, "body"), createAllocationController);

Router.patch("/:id/collect", collectManualController)
module.exports = Router;
