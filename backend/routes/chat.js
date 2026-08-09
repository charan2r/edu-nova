const express = require("express");
const { getCourseRecommendations } = require("../utils/chatService");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const Course = require("../models/Course");

// Chat - get course recommendations based on user input
router.post("/recommendations", middleware, async (req, res) => {
  const userInput = req.body?.input;

  if (!userInput) {
    return res.status(400).json({ message: "Input is required" });
  }

  try {
    // Fetch courses from MongoDB
    const availableCourses = await Course.find({ isDeleted: { $ne: true } })
      .populate("instructor", "fullname email")
      .populate("institute", "name logo")
      .lean();

    // Get AI recommendations using current database catalog
    const result = await getCourseRecommendations(userInput, availableCourses);

    const recommendedCourseIds = result.recommendedCourseIds || [];
    const aiMessage = result.message || "";

    const courseMap = new Map();
    availableCourses.forEach((c) => {
      courseMap.set(c._id.toString(), c);
    });

    const recommendedCourses = [];
    const addedIds = new Set();

    // Add courses selected by AI
    recommendedCourseIds.forEach((id) => {
      const idStr = id.toString();
      if (courseMap.has(idStr) && !addedIds.has(idStr)) {
        recommendedCourses.push(courseMap.get(idStr));
        addedIds.add(idStr);
      }
    });

    // Return AI message + found courses
    res.status(200).json({
      recommendations: recommendedCourses,
      message: aiMessage,
      courseCount: recommendedCourses.length,
    });
  } catch (error) {
    console.error("Error in chat route:", error);

    if (error.message && error.message.includes("Input")) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to fetch course recommendations" });
  }
});

module.exports = router;


