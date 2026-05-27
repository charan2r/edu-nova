const courseRepository = require("../repositories/courseRepository");
const userRepository = require("../repositories/userRepository");
const {
  ValidationError,
  NotFoundError,
  AuthError,
} = require("../utils/errors");

class CourseService {
  // Get all courses with pagination
  async getAllCourses(page = 1, limit = 10) {
    try {
      const courses = await courseRepository.findAll(page, limit);
      const total = await courseRepository.countTotalCourses();
      return {
        data: courses,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
  }

  // Get a specific course
  async getCourseById(courseId) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new NotFoundError("Course not found");
      }
      return course;
    } catch (error) {
      if (error.name === "NotFoundError") throw error;
      throw new Error(`Error fetching course: ${error.message}`);
    }
  }

  // Get all enrolled courses for a user
  async getUserEnrolledCourses(userId) {
    try {
      return await courseRepository.findUserEnrolledCourses(userId);
    } catch (error) {
      throw new Error(`Error fetching enrolled courses: ${error.message}`);
    }
  }

  // Get all courses by an instructor
  async getInstructorCourses(instructorId) {
    try {
      return await courseRepository.findByInstructorId(instructorId);
    } catch (error) {
      throw new Error(`Error fetching instructor courses: ${error.message}`);
    }
  }

  // Get enrolled students for a course
  async getEnrolledStudents(courseId, instructorId) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new NotFoundError("Course not found");
      }
      if (course.instructor._id.toString() !== instructorId) {
        throw new AuthError("You can only view students of your own courses");
      }

      return await courseRepository.findEnrolledStudents(courseId);
    } catch (error) {
      if (error.name === "NotFoundError" || error.name === "AuthError")
        throw error;
      throw new Error(`Error fetching enrolled students: ${error.message}`);
    }
  }

  // Create a new course
  async createCourse(instructorId, courseData, imageUrl = null) {
    try {
      if (!instructorId) {
        throw new AuthError("Instructor ID is required");
      }

      if (!courseData.name || !courseData.description) {
        throw new ValidationError("Name and description are required");
      }

      // Get instructor's institute
      const instructor = await userRepository.findById(instructorId);
      if (!instructor || !instructor.institute) {
        throw new AuthError(
          "Instructor must be assigned to an institute to create courses",
        );
      }

      const course = {
        name: courseData.name,
        description: courseData.description,
        content: courseData.content,
        image: imageUrl,
        category: courseData.category,
        level: courseData.level || "beginner",
        language: courseData.language || "English",
        instructor: instructorId,
        institute: instructor.institute,
        subscription: {
          isFree: courseData.isFree !== undefined ? courseData.isFree : true,
          price: courseData.price || 0,
          currency: courseData.currency || "USD",
        },
        totalDuration: courseData.totalDuration || 0,
        status: courseData.status || "draft",
      };

      return await courseRepository.create(course);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "AuthError")
        throw error;
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  // Update course details
  async updateCourse(courseId, instructorId, courseData) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new NotFoundError("Course not found");
      }

      if (course.instructor._id.toString() !== instructorId) {
        throw new AuthError("You can only update your own courses");
      }

      const updatedData = {
        ...courseData,
        updatedAt: new Date(),
      };

      return await courseRepository.update(courseId, updatedData);
    } catch (error) {
      if (error.name === "NotFoundError" || error.name === "AuthError")
        throw error;
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  // Delete a course
  async deleteCourse(courseId, instructorId) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new NotFoundError("Course not found");
      }

      if (course.instructor._id.toString() !== instructorId) {
        throw new AuthError("You can only delete your own courses");
      }

      await courseRepository.delete(courseId);
      return { message: "Course deleted successfully" };
    } catch (error) {
      if (error.name === "NotFoundError" || error.name === "AuthError")
        throw error;
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }

  // Enroll student in course
  async enrollStudent(courseId, studentId) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new NotFoundError("Course not found");
      }

      const isEnrolled = await courseRepository.isStudentEnrolled(
        courseId,
        studentId,
      );
      if (isEnrolled) {
        throw new ValidationError("Student already enrolled in this course");
      }

      // Enroll student in course
      await courseRepository.enrollStudent(courseId, studentId);

      // Automatically assign student to the course's institute
      const student = await userRepository.findById(studentId);
      if (student && !student.institute) {
        await userRepository.update(studentId, { institute: course.institute });
      }

      return await courseRepository.findById(courseId);
    } catch (error) {
      if (error.name === "NotFoundError" || error.name === "ValidationError")
        throw error;
      throw new Error(`Error enrolling student: ${error.message}`);
    }
  }

  // Unenroll student from course
  async unenrollStudent(courseId, studentId) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new NotFoundError("Course not found");
      }

      const isEnrolled = await courseRepository.isStudentEnrolled(
        courseId,
        studentId,
      );
      if (!isEnrolled) {
        throw new ValidationError("Student is not enrolled in this course");
      }

      return await courseRepository.unenrollStudent(courseId, studentId);
    } catch (error) {
      if (error.name === "NotFoundError" || error.name === "ValidationError")
        throw error;
      throw new Error(`Error unenrolling student: ${error.message}`);
    }
  }

  async searchCourses(searchTerm, page = 1, limit = 10) {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw new ValidationError("Search term is required");
      }

      return await courseRepository.findCoursesBySearchTerm(
        searchTerm,
        page,
        limit,
      );
    } catch (error) {
      if (error.name === "ValidationError") throw error;
      throw new Error(`Error searching courses: ${error.message}`);
    }
  }
}

module.exports = new CourseService();
