const instituteService = require("../services/instituteService");
const userRepository = require("../repositories/userRepository");
const courseService = require("../services/courseService");
const courseRepository = require("../repositories/courseRepository");
const {
  ValidationError,
  AuthError,
  NotFoundError,
} = require("../utils/errors");

class InstituteAdminController {
  // Get all institute admins (super_admin only)
  async getAllAdmins(req, res, next) {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const admins = await userRepository.findByRole("institute_admin");

      res.status(200).json({
        data: admins.map((admin) => ({
          id: admin._id,
          fullname: admin.fullname,
          email: admin.email,
          institute: admin.institute?.name || admin.institute || "N/A",
          instituteId: admin.institute?._id || admin.institute,
          createdAt: admin.createdAt,
          isActive: admin.isActive,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all instructors in institute
  async getInstructors(req, res, next) {
    try {
      if (req.user.role !== "institute_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const instructors = await userRepository.findByInstituteAndRole(
        req.user.institute,
        "instructor",
      );

      res.status(200).json({
        instructors,
      });
    } catch (error) {
      next(error);
    }
  }

  // Add instructor to institute
  async addInstructor(req, res, next) {
    try {
      if (req.user.role !== "institute_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { instructorId } = req.body;
      if (!instructorId) {
        return res.status(400).json({ message: "Instructor ID is required" });
      }

      const result = await instituteService.addInstructorToInstitute(
        req.user.institute,
        instructorId,
      );

      res.status(200).json({
        message: "Instructor added successfully",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove instructor from institute
  async removeInstructor(req, res, next) {
    try {
      if (req.user.role !== "institute_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { instructorId } = req.params;

      const result = await instituteService.removeInstructorFromInstitute(
        req.user.institute,
        instructorId,
      );

      res.status(200).json({
        message: "Instructor removed successfully",
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all courses in institute
  async getCourses(req, res, next) {
    try {
      if (req.user.role !== "institute_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { page = 1, limit = 10 } = req.query;

      const courses = await courseRepository.findByInstitute(
        req.user.institute,
      );

      // Paginate courses
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedCourses = courses.slice(startIndex, endIndex);

      res.status(200).json({
        courses: paginatedCourses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(courses.length / parseInt(limit)),
          total: courses.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all students in institute
  async getStudents(req, res, next) {
    try {
      if (req.user.role !== "institute_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { page = 1, limit = 10 } = req.query;

      const students = await userRepository.findByInstituteAndRole(
        req.user.institute,
        "student",
      );

      // Paginate students
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedStudents = students.slice(startIndex, endIndex);

      res.status(200).json({
        students: paginatedStudents,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(students.length / parseInt(limit)),
          total: students.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update institute settings
  async updateInstitute(req, res, next) {
    try {
      if (req.user.role !== "institute_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { name, description, email, phone, website, address, logo } =
        req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (website) updateData.website = website;
      if (address) updateData.address = address;
      if (logo) updateData.logo = logo;

      const result = await instituteService.updateInstitute(
        req.user.institute,
        updateData,
      );

      res.status(200).json({
        message: "Institute updated successfully",
        institute: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstituteAdminController();
