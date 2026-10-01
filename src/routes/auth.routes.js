const express = require("express");
const Router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { loginSchema, createUserSchema } = require("../validators/user.validators");

Router.post("/login", validate(loginSchema), authController.login);
Router.post("/users", protect, restrictTo("ADMIN"), validate(createUserSchema), authController.createUser);
Router.get("/me", protect, authController.me);

module.exports = Router;
