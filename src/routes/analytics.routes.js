const express = require("express");
const Router = express.Router();
const {
  getAnalyticsController,
} = require("../controllers/analytics.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

Router.get("/", protect, restrictTo("ADMIN"), getAnalyticsController);

module.exports = Router;
