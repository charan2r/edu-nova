import { apiClient } from "./api-client";

export interface LearningPathStepCourse {
  _id: string;
  name?: string;
  title?: string;
  description?: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  image?: string;
  estimatedHours?: number;
  skillsTaught?: string[];
}

export interface LearningPathStep {
  _id: string;
  order: number;
  course: LearningPathStepCourse | string;
  title: string;
  reason: string;
  skillsGained: string[];
  estimatedHours: number;
  status: "locked" | "available" | "in-progress" | "completed";
}

export interface LearningPathData {
  _id: string;
  student: string;
  institute?: string;
  title: string;
  careerGoal: string;
  currentSkills: string[];
  targetSkills: string[];
  missingSkills: string[];
  weeklyHours: number;
  estimatedWeeks: number;
  steps: LearningPathStep[];
  status: "active" | "completed" | "paused";
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePathInput {
  careerGoal: string;
  currentSkills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  weeklyHours: number;
  instituteId?: string;
}

export interface GeneratePathResponse {
  status: "created" | "clarification-required" | "no-matching-courses" | "prerequisites-unavailable";
  summary?: string;
  question?: string;
  message?: string;
  learningPath?: LearningPathData;
  unavailableCourses?: Array<{
    id: string;
    title: string;
    prerequisites: string[];
  }>;
}

export async function generateLearningPath(
  input: GeneratePathInput
): Promise<GeneratePathResponse> {
  return apiClient.post<GeneratePathResponse>("/learning-path/generate", input);
}

export async function getMyLearningPath(): Promise<{ learningPath: LearningPathData | null }> {
  return apiClient.get<{ learningPath: LearningPathData | null }>("/learning-path/my-path");
}

export async function updateStepStatus(
  stepId: string,
  status: "completed" | "in-progress" | "available" = "completed"
): Promise<{ message: string; learningPath: LearningPathData }> {
  return apiClient.patch<{ message: string; learningPath: LearningPathData }>(
    `/learning-path/step/${stepId}`,
    { status }
  );
}

export async function deleteMyLearningPath(): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>("/learning-path/my-path");
}
