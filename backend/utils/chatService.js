const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCourseRecommendations(userInput) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI course recommendation assistant for Edu Nova, an online learning platform specializing in IT courses.

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

Extract keywords or subjects from the user's input that can be used to search course database. Respond with a comma-separated list of relevant courses only.`,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      max_tokens: 150,
    });

    const content = chatCompletion?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Invalid response from OpenAI:", chatCompletion);
      throw new Error("No content returned by OpenAI");
    }

    // Extract keywords from the content
    const keywords = content
      .split(/,|\n|---|:/)
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    return keywords;
  } catch (err) {
    console.error("Error fetching course recommendations:", err);
    throw new Error(err.message || "Failed to fetch course recommendations");
  }
}

module.exports = { getCourseRecommendations };
