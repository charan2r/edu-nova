const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 20000, // 20 second timeout
});

const SYSTEM_PROMPT = `You are an AI Course Advisor for Edu Nova, an online learning platform specializing in IT courses.

Your role is to help students find the perfect courses based on their:
- Current skill level (beginner, intermediate, advanced)
- Learning goals and career aspirations
- Areas of interest (web development, data science, cloud computing, cybersecurity, etc.)
- Time availability

Available course categories include:
- Web Development (React, Node.js, Full Stack)
- Data Science (Python, Machine Learning, Data Analysis)
- Cloud Computing (AWS, Azure, Google Cloud)
- Cybersecurity (Ethical Hacking, Network Security)
- DevOps (Docker, Kubernetes, CI/CD)
- Mobile Development (React Native, iOS, Android)

When recommending courses:
1. Ask clarifying questions to understand the student's needs
2. Provide personalized recommendations with reasoning
3. Explain learning paths and course sequences
4. Mention prerequisites when relevant
5. Be encouraging and supportive

Keep responses concise but helpful. Use bullet points for clarity when listing multiple items.`;

// Extract keywords for database search
function extractKeywords(text) {
  const keywords = [
    "python",
    "javascript",
    "react",
    "node",
    "java",
    "web",
    "data",
    "science",
    "cloud",
    "aws",
    "azure",
    "devops",
    "docker",
    "kubernetes",
    "cybersecurity",
    "security",
    "frontend",
    "backend",
    "fullstack",
    "mobile",
    "sql",
    "database",
    "api",
    "machine",
    "ai",
    "ml",
  ];

  const lowerText = text.toLowerCase();
  return keywords.filter((keyword) => lowerText.includes(keyword));
}

async function getCourseRecommendations(userInput) {
  try {
    // Get AI-generated response with intelligent recommendations
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = chatCompletion?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Invalid response from Groq:", chatCompletion);
      throw new Error("No content returned by Groq");
    }

    // Extract keywords for database search
    const keywords = extractKeywords(userInput);

    return {
      message: content,
      keywords: keywords,
    };
  } catch (err) {
    console.error("Error fetching course recommendations:", err);
    throw new Error(err.message || "Failed to fetch course recommendations");
  }
}

module.exports = { getCourseRecommendations };
