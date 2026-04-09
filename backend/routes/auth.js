const express = require("express");
const authController = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

router.post("/register", authController.register.bind(authController));
router.post("/login", authLimiter, authController.login.bind(authController));
router.post("/refresh", authController.refreshAccessToken.bind(authController));
router.post("/logout", authController.logout.bind(authController));

module.exports = router;
