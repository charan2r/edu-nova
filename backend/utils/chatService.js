const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 20000, // 20 second timeout
});

async function getCourseRecommendations(userInput, availableCourses = []) {
  try {
    // Format available courses catalog for the system prompt
    let courseCatalogText = "";
    if (availableCourses && availableCourses.length > 0) {
      courseCatalogText = availableCourses
        .map((c, index) => {
          const id = c._id ? c._id.toString() : index;
          const title = c.name || "Untitled Course";
          const category = c.category || "General";
          const level = c.level || "all levels";
          const desc = (c.description || "").slice(0, 150);
          const price = c.subscription?.isFree ? "Free" : `$${c.subscription?.price || 0}`;
          return `ID: ${id} | Title: "${title}" | Category: ${category} | Level: ${level} | Price: ${price} | Description: ${desc}`;
        })
        .join("\n");
    }

    const systemPrompt = `You are an AI Course Advisor for Edu Nova, an online learning platform specializing in IT courses.

Your role is to help students find the best matching courses from our database based on their skill level, learning goals, time availability, and interests.

${
  courseCatalogText
    ? `Here are the AVAILABLE COURSES currently in our database:\n${courseCatalogText}\n`
    : "Currently no database courses catalog provided."
}

INSTRUCTIONS FOR YOUR RESPONSE:
1. Recommend specific courses from the AVAILABLE COURSES list above that match the student's request.
2. Be helpful, concise, and explain why the recommended courses fit their goals.
3. You MUST format your final response as a JSON object with two fields:
   - "message": (string) Your response text explaining the recommendations to the student.
   - "recommendedCourseIds": (array of strings) The exact ID strings of the courses from the AVAILABLE COURSES list that you recommend (max 5 courses).

Example JSON response format:
{
  "message": "Based on your interest in web development, I recommend...",
  "recommendedCourseIds": ["64a1f...", "64a2b..."]
}`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      max_tokens: 700,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const rawContent = chatCompletion?.choices?.[0]?.message?.content;

    if (!rawContent) {
      console.error("Invalid response from Groq:", chatCompletion);
      throw new Error("No content returned by Groq");
    }

    let parsedResult = { message: "", recommendedCourseIds: [] };

    try {
      parsedResult = JSON.parse(rawContent);
    } catch (parseErr) {
      // Fallback if response format JSON parser fails
      console.warn("Could not parse Groq JSON, using raw text:", parseErr);
      parsedResult = {
        message: rawContent,
        recommendedCourseIds: [],
      };
    }

    return {
      message: parsedResult.message || rawContent,
      recommendedCourseIds: Array.isArray(parsedResult.recommendedCourseIds)
        ? parsedResult.recommendedCourseIds
        : [],
    };
  } catch (err) {
    console.error("Error fetching course recommendations:", err);
    throw new Error(err.message || "Failed to fetch course recommendations");
  }
}

module.exports = { getCourseRecommendations };
