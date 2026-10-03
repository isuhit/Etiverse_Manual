const Router = require("express").Router();
const { createManualController, getAllManualController, getManualByIdController, updateManualController } = require("../controllers/manual.controller");
const { manualSchema,patchManualSchema } = require("../validators/manual.validator");
const { validate } = require("../middleware/validate.middleware");
const { protect, restrictTo } = require("../middleware/auth.middleware");



Router.post("/",protect, restrictTo("ADMIN"), validate(manualSchema), createManualController);
Router.get("/", getAllManualController);
Router.get("/:id", protect, getManualByIdController);
Router.patch("/:id", protect, restrictTo("ADMIN"), validate(patchManualSchema), updateManualController);


module.exports = Router;
