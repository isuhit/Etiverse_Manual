const express = require("express");
const app = express();
const errorMiddleware = require("./src/middleware/error.middleware");

app.use(express.json());

//ROUTES
const authRoutes = require("./src/routes/auth.routes");
const studentRoutes = require("./src/routes/student.routes");
const manualRoutes = require("./src/routes/manual.routes");
const paymentRoutes = require("./src/routes/payment.routes");


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



app.use(errorMiddleware);
module.exports = app;
