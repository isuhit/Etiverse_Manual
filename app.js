const express = require("express");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./src/middleware/error.middleware");

// Allow requests from the frontend (file://, localhost, or any origin during dev)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

//ROUTES
const authRoutes = require("./src/routes/auth.routes");
const studentRoutes = require("./src/routes/student.routes");
const manualRoutes = require("./src/routes/manual.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const allocationRoutes = require("./src/routes/allocation.routes");
const analyticsRoutes = require("./src/routes/analytics.routes");

app.get("/health", (req, res) => {
  console.log(req.headers);
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    response: "Server is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/manuals", manualRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/allocations", allocationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.use(errorMiddleware);
module.exports = app;
