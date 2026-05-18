export interface Course {
  id: string;
  title: string;
  description: string;
  content?: string;
  instructor: string;
  instructorId: string;
  students: number;
  rating: number;
  image: string;
}

export const categories = [
  "Fullstack Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
];
