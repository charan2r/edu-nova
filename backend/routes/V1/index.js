const express = require("express");
const authRoutes = require("../auth");
const courseRoutes = require("../course");
const instituteRoutes = require("../institute");
const instituteAdminRoutes = require("../instituteAdmin");
const chatRoutes = require("../chat");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/institute", instituteRoutes);
router.use("/admin/institute", instituteAdminRoutes);
router.use("/course", courseRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
