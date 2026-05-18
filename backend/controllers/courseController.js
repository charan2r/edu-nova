const courseService = require("../services/courseService");

class CourseController {
  async getAllCourses(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await courseService.getAllCourses(
        parseInt(page),
        parseInt(limit),
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  async getUserEnrolledCourses(req, res, next) {
    try {
      const courses = await courseService.getUserEnrolledCourses(req.user.id);
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getInstructorCourses(req, res, next) {
    try {
      if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied" });
      }
      const courses = await courseService.getInstructorCourses(req.user.id);
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledStudents(req, res, next) {
    try {
      if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied" });
      }
      const students = await courseService.getEnrolledStudents(
        req.params.id,
        req.user.id,
      );
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req, res, next) {
    try {
      if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied" });
      }

      let imageUrl = null;
      if (req.file) {
        const imagekit = require("../config/imagekit");
        const image = await imagekit.upload({
          file: req.file.buffer.toString("base64"),
          fileName: `course_${Date.now()}.jpg`,
          folder: "/courses",
        });
        imageUrl = image.url;
      }

      const course = await courseService.createCourse(
        req.user.id,
        req.body,
        imageUrl,
      );
      res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req, res, next) {
    try {
      if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied" });
      }

      const course = await courseService.updateCourse(
        req.params.id,
        req.user.id,
        req.body,
      );
      res.status(200).json({
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied" });
      }

      await courseService.deleteCourse(req.params.id, req.user.id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async enrollCourse(req, res, next) {
    try {
      const course = await courseService.enrollStudent(
        req.params.id,
        req.user.id,
      );
      res.status(200).json({
        message: "Enrolled successfully",
        course,
      });
    } catch (error) {
      next(error);
    }
  }

  async unenrollCourse(req, res, next) {
    try {
      const course = await courseService.unenrollStudent(
        req.params.id,
        req.user.id,
      );
      res.status(200).json({
        message: "Unenrolled successfully",
        course,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchCourses(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;
      const courses = await courseService.searchCourses(
        q,
        parseInt(page),
        parseInt(limit),
      );
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
