"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { type Course, initialCourses } from "./courses-data"

interface CoursesContextType {
  courses: Course[]
  enrolledCourses: string[]
  addCourse: (course: Omit<Course, "id" | "students" | "rating">) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
  enrollInCourse: (courseId: string) => void
  unenrollFromCourse: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  getInstructorCourses: (instructorId: string) => Course[]
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  const addCourse = useCallback((courseData: Omit<Course, "id" | "students" | "rating">) => {
    const newCourse: Course = {
      ...courseData,
      id: Math.random().toString(36).substr(2, 9),
      students: 0,
      rating: 0,
    }
    setCourses((prev) => [...prev, newCourse])
  }, [])

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, ...updates } : course))
    )
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id))
  }, [])

  const enrollInCourse = useCallback((courseId: string) => {
    setEnrolledCourses((prev) => {
      if (prev.includes(courseId)) return prev
      return [...prev, courseId]
    })
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, students: course.students + 1 } : course
      )
    )
  }, [])

  const unenrollFromCourse = useCallback((courseId: string) => {
    setEnrolledCourses((prev) => prev.filter((id) => id !== courseId))
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, students: Math.max(0, course.students - 1) } : course
      )
    )
  }, [])

  const isEnrolled = useCallback((courseId: string) => {
    return enrolledCourses.includes(courseId)
  }, [enrolledCourses])

  const getInstructorCourses = useCallback((instructorId: string) => {
    return courses.filter((course) => course.instructorId === instructorId)
  }, [courses])

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
      }}
    >
      {children}
    </CoursesContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CoursesContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CoursesProvider")
  }
  return context
}
