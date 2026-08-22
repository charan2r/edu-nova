const Groq = require("groq-sdk");
const { z } = require("zod");
const Course = require("../models/Course");
const LearningPath = require("../models/LearningPath");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 30000,
});

const GROQ_MODEL = "openai/gpt-oss-120b";

// ---------------------------------------------------------------------------
// 1. Student Goal & Skill Gap Analysis (AI)
// ---------------------------------------------------------------------------
const studentAnalysisSchema = z.object({
  normalizedCurrentSkills: z.array(z.string()).default([]),
  targetSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  careerGoal: z.string().min(3),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  recommendedCategories: z.array(z.string()).default([]),
  clarificationNeeded: z.boolean(),
  clarificationQuestion: z.string().nullable(),
});

const ANALYSIS_PROMPT = `
You are the requirement-analysis component of Edu Nova's Adaptive Learning Path Generator.

Analyze the student's learning profile.

Return only valid JSON with this exact structure:

{
  "normalizedCurrentSkills": ["string"],
  "targetSkills": ["string"],
  "missingSkills": ["string"],
  "careerGoal": "string",
  "experienceLevel": "beginner | intermediate | advanced",
  "recommendedCategories": ["string"],
  "clarificationNeeded": false,
  "clarificationQuestion": null
}

Rules:
- Normalize equivalent terms (e.g. JS -> javascript).
- Convert tech stacks (e.g. "MERN" into MongoDB, Express.js, React, and Node.js).
- Do not treat an existing skill as a missing skill.
- missingSkills must represent the gap between current skills and the goal.
- Use lowercase canonical skill names.
- Ask for clarification only when the goal is too vague.
- Do not recommend course names.
- Do not include markdown.
`;

async function analyzeLearningGoal(profile) {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: ANALYSIS_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(profile),
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 0.2,
    max_tokens: 2048,
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty student analysis");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Groq returned invalid JSON");
  }

  return studentAnalysisSchema.parse(parsed);
}

// ---------------------------------------------------------------------------
// 2. Course Search & Catalog Filtering
// ---------------------------------------------------------------------------
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeCategoryPattern(category) {
  const trimmed = category.trim();
  const flexible = escapeRegex(trimmed).replace(/[\s\-_]+/g, "[\\s\\-_]*");
  return new RegExp(`^${flexible}$`, "i");
}

async function findCandidateCourses({
  instituteId,
  missingSkills = [],
  recommendedCategories = [],
}) {
  const skillPatterns = (missingSkills || []).map(
    (skill) => new RegExp(escapeRegex(skill), "i")
  );

  const categoryPatterns = (recommendedCategories || []).map(
    normalizeCategoryPattern
  );

  const orConditions = [];

  if (skillPatterns.length > 0) {
    orConditions.push(
      { skillsTaught: { $in: skillPatterns } },
      { prerequisiteSkills: { $in: skillPatterns } },
      { name: { $in: skillPatterns } },
      { title: { $in: skillPatterns } }
    );
  }

  if (categoryPatterns.length > 0) {
    orConditions.push({
      category: { $in: categoryPatterns },
    });
  }

  if (orConditions.length === 0) {
    return [];
  }

  const baseQuery = {
    status: "published",
    $or: orConditions,
  };

  // 1. If instituteId is provided, first search for institute-specific courses
  if (instituteId) {
    const instituteQuery = {
      ...baseQuery,
      institute: instituteId,
    };

    const instituteCourses = await Course.find(instituteQuery)
      .select(
        "name title description category level skillsTaught prerequisiteSkills estimatedHours"
      )
      .limit(30)
      .lean();

    if (instituteCourses.length > 0) {
      return instituteCourses;
    }
  }

  // 2. Fallback gracefully to all published courses across the platform
  return Course.find(baseQuery)
    .select(
      "name title description category level skillsTaught prerequisiteSkills estimatedHours"
    )
    .limit(30)
    .lean();
}

// ---------------------------------------------------------------------------
// 3. Prerequisites & Course Sequencing
// ---------------------------------------------------------------------------
function normalizeSkill(skill) {
  return skill.trim().toLowerCase();
}

function evaluateCourseReadiness(course, acquiredSkills) {
  const availableSkills = new Set(acquiredSkills.map(normalizeSkill));
  const prerequisites = (course.prerequisiteSkills || []).map(normalizeSkill);

  const matchedPrerequisites = prerequisites.filter((skill) =>
    availableSkills.has(skill)
  );

  const missingPrerequisites = prerequisites.filter(
    (skill) => !availableSkills.has(skill)
  );

  const readinessScore =
    prerequisites.length === 0
      ? 100
      : Math.round((matchedPrerequisites.length / prerequisites.length) * 100);

  return {
    course,
    readinessScore,
    matchedPrerequisites,
    missingPrerequisites,
    isReady: missingPrerequisites.length === 0,
  };
}

function createValidCourseSequence(courses, currentSkills) {
  const acquiredSkills = new Set(currentSkills.map(normalizeSkill));
  const remainingCourses = [...courses];
  const orderedCourses = [];

  let progressMade = true;

  while (remainingCourses.length > 0 && progressMade) {
    progressMade = false;

    for (let index = remainingCourses.length - 1; index >= 0; index -= 1) {
      const course = remainingCourses[index];

      const readiness = evaluateCourseReadiness(
        course,
        Array.from(acquiredSkills)
      );

      if (!readiness.isReady) {
        continue;
      }

      orderedCourses.push(course);

      for (const skill of course.skillsTaught || []) {
        acquiredSkills.add(normalizeSkill(skill));
      }

      remainingCourses.splice(index, 1);
      progressMade = true;
    }
  }

  return {
    orderedCourses,
    excludedCourses: remainingCourses,
    finalSkills: Array.from(acquiredSkills),
  };
}

// ---------------------------------------------------------------------------
// 4. Learning Path AI Explanation & Step Synthesis
// ---------------------------------------------------------------------------
const pathResponseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  steps: z.array(
    z.object({
      courseId: z.string(),
      reason: z.string(),
      skillsGained: z.array(z.string()).default([]),
    })
  ),
});

const PATH_PROMPT = `
You organize validated Edu Nova courses into a personalized learning path.

You will receive:
1. The student's profile.
2. Their skill-gap analysis.
3. A list of real courses already ordered by the backend.

Return only valid JSON:

{
  "title": "string",
  "summary": "string",
  "steps": [
    {
      "courseId": "string",
      "reason": "string",
      "skillsGained": ["string"]
    }
  ]
}

Rules:
- Use only the supplied course IDs.
- Do not invent courses.
- Preserve the supplied course order.
- Explain how each course closes a skill gap.
- Keep each reason under 35 words.
- Do not include markdown.
`;

async function generatePathExplanation({
  profile,
  analysis,
  orderedCourses,
}) {
  const courseContext = orderedCourses.map((course) => ({
    courseId: course._id.toString(),
    title: course.name || course.title || "Untitled Course",
    category: course.category,
    level: course.level,
    skillsTaught: course.skillsTaught || [],
    prerequisiteSkills: course.prerequisiteSkills || [],
    estimatedHours: course.estimatedHours || 0,
  }));

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: PATH_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify({
          profile,
          analysis,
          courses: courseContext,
        }),
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 0.3,
    max_tokens: 4096,
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty learning path");
  }

  const parsed = JSON.parse(content);
  const validated = pathResponseSchema.parse(parsed);

  const allowedIds = new Set(
    orderedCourses.map((course) => course._id.toString())
  );

  const invalidCourse = validated.steps.find(
    (step) => !allowedIds.has(step.courseId)
  );

  if (invalidCourse) {
    throw new Error("AI returned a course outside the candidate list");
  }

  return validated;
}

// ---------------------------------------------------------------------------
// 5. Main Adaptive Learning Path Pipeline
// ---------------------------------------------------------------------------
async function createAdaptiveLearningPath({
  studentId,
  instituteId,
  profile,
}) {
  const analysis = await analyzeLearningGoal(profile);

  if (analysis.clarificationNeeded) {
    return {
      status: "clarification-required",
      question: analysis.clarificationQuestion,
    };
  }

  const candidateCourses = await findCandidateCourses({
    instituteId,
    missingSkills: analysis.missingSkills,
    recommendedCategories: analysis.recommendedCategories,
  });

  if (candidateCourses.length === 0) {
    return {
      status: "no-matching-courses",
      analysis,
      message:
        "Your institute currently has no published courses covering the identified skill gaps.",
    };
  }

  const { orderedCourses, excludedCourses } = createValidCourseSequence(
    candidateCourses,
    analysis.normalizedCurrentSkills
  );

  if (orderedCourses.length === 0) {
    return {
      status: "prerequisites-unavailable",
      analysis,
      unavailableCourses: excludedCourses.map((course) => ({
        id: course._id,
        title: course.name || course.title || "Untitled Course",
        prerequisites: course.prerequisiteSkills || [],
      })),
    };
  }

  const aiPath = await generatePathExplanation({
    profile,
    analysis,
    orderedCourses,
  });

  const coursesById = new Map(
    orderedCourses.map((course) => [course._id.toString(), course])
  );

  const totalHours = orderedCourses.reduce(
    (sum, course) => sum + (course.estimatedHours || 0),
    0
  );

  const weeklyHours = Math.max(profile.weeklyHours || 10, 1);
  const estimatedWeeks = Math.ceil(totalHours / weeklyHours) || 1;

  const steps = aiPath.steps.map((step, index) => {
    const course = coursesById.get(step.courseId);

    return {
      order: index + 1,
      course: course._id,
      title: course.name || course.title || "Untitled Course",
      reason: step.reason,
      skillsGained: course.skillsTaught || [],
      estimatedHours: course.estimatedHours || 0,
      status: index === 0 ? "available" : "locked",
    };
  });

  const learningPath = await LearningPath.create({
    student: studentId,
    institute: instituteId,
    title: aiPath.title,
    careerGoal: analysis.careerGoal,
    currentSkills: analysis.normalizedCurrentSkills,
    targetSkills: analysis.targetSkills,
    missingSkills: analysis.missingSkills,
    weeklyHours,
    estimatedWeeks,
    steps,
  });

  return {
    status: "created",
    summary: aiPath.summary,
    learningPath,
  };
}

module.exports = {
  createAdaptiveLearningPath,
  analyzeLearningGoal,
  findCandidateCourses,
  evaluateCourseReadiness,
  createValidCourseSequence,
  generatePathExplanation,
};