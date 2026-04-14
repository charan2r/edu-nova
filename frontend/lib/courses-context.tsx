"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Course } from "./courses-data";

interface CoursesContextType {
  courses: Course[];
  enrolledCourses: string[];
  addCourse: (course: Omit<Course, "id" | "students" | "rating">) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  enrollInCourse: (courseId: string) => void;
  unenrollFromCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  getInstructorCourses: (instructorId: string) => Course[];
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  // TODO: Implement courses management with backend API

  return (
    <CoursesContext.Provider
      value={{
        courses: [],
        enrolledCourses: [],
        addCourse: () => {},
        updateCourse: () => {},
        deleteCourse: () => {},
        enrollInCourse: () => {},
        unenrollFromCourse: () => {},
        isEnrolled: () => false,
        getInstructorCourses: () => [],
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return context;
}
