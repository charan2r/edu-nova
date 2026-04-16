const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const v1Routes = require("./routes/V1");
const { errorHandler } = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "user-id"],
  }),
);
app.use(express.json());

// Apply general rate limiting to all API routes
app.use("/api/", generalLimiter);

// API routes
app.use("/api/v1", v1Routes);

// Global error handler
app.use(errorHandler);

// Starting server
app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
