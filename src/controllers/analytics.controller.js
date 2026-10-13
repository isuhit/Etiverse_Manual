const { getAnalyticsService } = require("../services/analytics.service");
const asyncHandler = require("../utils/async-handler");

const getAnalyticsController = asyncHandler(async (req, res) => {
  const analytics = await getAnalyticsService();

  res.status(200).json({
    success: true,
    message: "Analytics retrieved successfully",
    data: analytics,
  });
});

module.exports = { getAnalyticsController };
