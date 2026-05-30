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
    // Get AI-generated recommendations from the chat service
    const result = await getCourseRecommendations(userInput);

    const keywords = result.keywords || [];
    const aiMessage = result.message || "";

    // Build search query only if keywords exist
    let recommendedCourses = [];
    if (keywords && keywords.length > 0) {
      const regexArray = keywords.flatMap((keyword) => [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ]);

      recommendedCourses = await Course.find({ $or: regexArray }).limit(10);
    }

    // Return AI message + found courses
    res.status(200).json({
      recommendations: recommendedCourses,
      message: aiMessage,
      courseCount: recommendedCourses.length,
    });
  } catch (error) {
    console.error("Error in chat route:", error);

    if (error.message.includes("Input")) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to fetch course recommendations" });
  }
});

module.exports = router;
