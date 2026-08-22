const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const learningPathController = require("../controllers/learningPathController");

// Generate learning path
router.post(
  "/generate",
  middleware,
  learningPathController.generatePath.bind(learningPathController)
);

// Get current student's active learning path
router.get(
  "/my-path",
  middleware,
  learningPathController.getMyPath.bind(learningPathController)
);

// Update step status (e.g. mark complete)
router.patch(
  "/step/:stepId",
  middleware,
  learningPathController.updateStepStatus.bind(learningPathController)
);

// Reset current student's learning path
router.delete(
  "/my-path",
  middleware,
  learningPathController.deleteMyPath.bind(learningPathController)
);

module.exports = router;
