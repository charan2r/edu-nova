const courseRepository = require("../repositories/courseRepository");
const {
  ValidationError,
  NotFoundError,
  AuthError,
} = require("../utils/errors");

class CourseService {
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

  async getUserEnrolledCourses(userId) {
    try {
      return await courseRepository.findUserEnrolledCourses(userId);
    } catch (error) {
      throw new Error(`Error fetching enrolled courses: ${error.message}`);
    }
  }

  async getInstructorCourses(instructorId) {
    try {
      return await courseRepository.findByInstructorId(instructorId);
    } catch (error) {
      throw new Error(`Error fetching instructor courses: ${error.message}`);
    }
  }

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

  async createCourse(instructorId, courseData, imageUrl = null) {
    try {
      if (!instructorId) {
        throw new AuthError("Instructor ID is required");
      }

      if (!courseData.name || !courseData.description || !courseData.content) {
        throw new ValidationError(
          "Name, description, and content are required",
        );
      }

      const course = {
        ...courseData,
        image: imageUrl,
        instructor: instructorId,
      };

      return await courseRepository.create(course);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "AuthError")
        throw error;
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

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

      return await courseRepository.enrollStudent(courseId, studentId);
    } catch (error) {
      if (error.name === "NotFoundError" || error.name === "ValidationError")
        throw error;
      throw new Error(`Error enrolling student: ${error.message}`);
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
