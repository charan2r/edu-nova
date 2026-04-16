"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Course } from "./courses-data";
import { courseApi } from "./course-api";
import { useAuth } from "./auth-context";

interface CoursesContextType {
  courses: Course[];
  enrolledCourses: string[];
  addCourse: (
    course: Omit<Course, "id" | "students" | "rating">,
    imageFile?: File,
    courseContent?: string,
  ) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  enrollInCourse: (courseId: string) => void;
  unenrollFromCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  getInstructorCourses: (instructorId: string) => Course[];
  isLoading: boolean;
  error: string | null;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await courseApi.getAllCourses();

        const transformedCourses = (response.data || []).map((course: any) => ({
          id: course._id,
          title: course.name,
          description: course.description,
          instructor: course.instructor?.fullname || "Unknown",
          instructorId: course.instructor?._id || "",
          students: course.students?.length || 0,
          rating: 4.5,
          image: course.image || "/api/placeholder/400/225",
        }));

        setCourses(transformedCourses);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch courses";
        setError(message);
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await courseApi.getEnrolledCourses();
        const enrolledIds = (response || []).map((course: any) => course._id);
        setEnrolledCourses(enrolledIds);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, [isAuthenticated]);

  const addCourse = async (
    course: Omit<Course, "id" | "students" | "rating">,
    imageFile?: File,
    courseContent?: string,
  ) => {
    try {
      setError(null);
      const courseInput = {
        name: course.title,
        description: course.description,
        content: courseContent || course.description,
        image: imageFile,
      };

      const result = await courseApi.createCourse(courseInput);

      // Refresh courses
      const response = await courseApi.getAllCourses();
      const transformedCourses = (response.data || []).map((c: any) => ({
        id: c._id,
        title: c.name,
        description: c.description,
        instructor: c.instructor?.fullname || "Unknown",
        instructorId: c.instructor?._id || "",
        students: c.students?.length || 0,
        rating: 4.5,
        image: c.image || "/api/placeholder/400/225",
      }));
      setCourses(transformedCourses);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create course";
      setError(message);
      throw err;
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      setError(null);
      await courseApi.updateCourse(id, {
        name: updates.title,
        description: updates.description,
        content: updates.description,
      });

      // Update local state
      setCourses(courses.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update course";
      setError(message);
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setError(null);
      await courseApi.deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete course";
      setError(message);
      throw err;
    }
  };

  const enrollInCourse = (courseId: string) => {
    setEnrolledCourses([...enrolledCourses, courseId]);
  };

  const unenrollFromCourse = (courseId: string) => {
    setEnrolledCourses(enrolledCourses.filter((id) => id !== courseId));
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.includes(courseId);
  };

  const getInstructorCourses = (instructorId: string) => {
    return courses.filter((course) => course.instructorId === instructorId);
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        enrolledCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        enrollInCourse,
        unenrollFromCourse,
        isEnrolled,
        getInstructorCourses,
        isLoading,
        error,
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
