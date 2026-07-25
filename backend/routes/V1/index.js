const express = require("express");
const authRoutes = require("../auth");
const courseRoutes = require("../course");
const chatRoutes = require("../chat");
const adminRoutes = require("../admin");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/chat", chatRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
