const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const chatRoutes = require("./routes/chat");
const path = require("path");

const app = express();
app.use(
  cors({
    origin: [
      "https://learning-management-system-one-green.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/course", courseRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Starting server
app.listen(5000, () => {
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
