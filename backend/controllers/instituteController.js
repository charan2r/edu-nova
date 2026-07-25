const instituteService = require("../services/instituteService");
const userRepository = require("../repositories/userRepository");
const courseRepository = require("../repositories/courseRepository");

class InstituteController {
  // Institute Management 

  // Create new institute (admin only)
  async createInstitute(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { name, email, phone, website, description, logo, address } =
        req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      const institute = await instituteService.createInstitute({
        name,
        email,
        phone,
        website,
        description,
        logo,
        address,
      });

      return res
        .status(201)
        .json({ message: "Institute created successfully", data: institute });
    } catch (error) {
      next(error);
    }
  }

  // Get all institutes (admin only)
  async getAllInstitutes(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const institutes = await instituteService.getAllInstitutes();
      return res.json({ data: institutes });
    } catch (error) {
      next(error);
    }
  }

  // Get a single institute by ID (admin only)
  async getInstituteById(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { instituteId } = req.params;
      const institute = await instituteService.getInstituteById(instituteId);
      return res.json({ data: institute });
    } catch (error) {
      next(error);
    }
  }

  // Update institute (admin only)
  async updateInstitute(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { instituteId } = req.params;
      const updateData = req.body;

      const institute = await instituteService.updateInstitute(
        instituteId,
        updateData,
      );
      return res.json({
        message: "Institute updated successfully",
        data: institute,
      });
    } catch (error) {
      next(error);
    }
  }

  // Soft-delete institute (admin only)
  async deleteInstitute(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { instituteId } = req.params;
      await instituteService.deleteInstitute(instituteId);
      return res.json({ message: "Institute deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // User Management (admin only) 

  // Get all users
  async getAllUsers(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { role } = req.query;
      let users;

      if (role && ["student", "instructor", "admin"].includes(role)) {
        users = await userRepository.findByRole(role);
      } else {
        users = await userRepository.findAll();
      }

      return res.json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  // Toggle user active status (admin only)
  async toggleUserStatus(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { userId } = req.params;
      const user = await userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updated = await userRepository.update(userId, {
        isActive: !user.isActive,
      });

      return res.json({
        message: `User ${updated.isActive ? "activated" : "deactivated"} successfully`,
        data: { id: updated._id, isActive: updated.isActive },
      });
    } catch (error) {
      next(error);
    }
  }

  // Course Management

  // Get all courses
  async getAllCourses(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { page = 1, limit = 10 } = req.query;
      const courses = await courseRepository.findAll(
        parseInt(page),
        parseInt(limit),
      );
      const total = await courseRepository.countTotalCourses();

      return res.json({
        data: courses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete any course 
  async deleteCourse(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { courseId } = req.params;
      const course = await courseRepository.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      await courseRepository.delete(courseId);
      return res.json({ message: "Course deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstituteController();
