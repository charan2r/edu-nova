export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  image: string;
  tags: string[];
}

export const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "Blockchain",
];
