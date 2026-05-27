const instituteService = require("../services/instituteService");

class InstituteController {
  // Create new institute (super_admin only)
  async createInstitute(req, res, next) {
    try {
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

  // Get all institutes
  async getAllInstitutes(req, res, next) {
    try {
      const institutes = await instituteService.getAllInstitutes();
      return res.json({ data: institutes });
    } catch (error) {
      next(error);
    }
  }

  // Get institute details
  async getInstituteById(req, res, next) {
    try {
      const { instituteId } = req.params;
      const institute = await instituteService.getInstituteById(instituteId);
      return res.json({ data: institute });
    } catch (error) {
      next(error);
    }
  }

  // Update institute (super_admin only)
  async updateInstitute(req, res, next) {
    try {
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

  // Add instructor to institute (super_admin onboards instructor)
  async addInstructor(req, res, next) {
    try {
      const { instituteId } = req.params;
      const { instructorId } = req.body;

      if (!instructorId) {
        return res.status(400).json({ message: "Instructor ID is required" });
      }

      const institute = await instituteService.addInstructorToInstitute(
        instituteId,
        instructorId,
      );

      return res.json({
        message: "Instructor added to institute successfully",
        data: institute,
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove instructor from institute
  async removeInstructor(req, res, next) {
    try {
      const { instituteId } = req.params;
      const { instructorId } = req.body;

      if (!instructorId) {
        return res.status(400).json({ message: "Instructor ID is required" });
      }

      const institute = await instituteService.removeInstructorFromInstitute(
        instituteId,
        instructorId,
      );

      return res.json({
        message: "Instructor removed from institute successfully",
        data: institute,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get institute instructors
  async getInstructors(req, res, next) {
    try {
      const { instituteId } = req.params;
      const instructors =
        await instituteService.getInstituteInstructors(instituteId);
      return res.json({ data: instructors });
    } catch (error) {
      next(error);
    }
  }

  // Delete institute (super_admin only - soft delete)
  async deleteInstitute(req, res, next) {
    try {
      const { instituteId } = req.params;
      await instituteService.deleteInstitute(instituteId);
      return res.json({ message: "Institute deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstituteController();
