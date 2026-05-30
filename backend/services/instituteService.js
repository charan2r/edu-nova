const instituteRepository = require("../repositories/instituteRepository");
const userRepository = require("../repositories/userRepository");
const { ValidationError, AuthError } = require("../utils/errors");

class InstituteService {
  // Create a new institute
  async createInstitute(instituteData) {
    const existingInstitute = await instituteRepository.findByName(
      instituteData.name,
    );
    if (existingInstitute) {
      throw new ValidationError("Institute name already exists");
    }

    return instituteRepository.create(instituteData);
  }

  // Get institute details by ID
  async getInstituteById(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }
    return institute;
  }

  // Get all institutes
  async getAllInstitutes() {
    return instituteRepository.findAll();
  }

  // Update institute
  async updateInstitute(instituteId, updateData) {
    const institute = await instituteRepository.update(instituteId, updateData);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }
    return institute;
  }

  // Add instructor to institute (admin adds instructor)
  async addInstructorToInstitute(instituteId, instructorId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }

    const instructor = await userRepository.findById(instructorId);
    if (!instructor) {
      throw new ValidationError("Instructor not found");
    }

    if (instructor.role !== "instructor") {
      throw new ValidationError("User is not an instructor");
    }

    // Update instructor's institute reference
    await userRepository.update(instructorId, { institute: instituteId });

    return instituteRepository.addInstructor(instituteId, instructorId);
  }

  // Remove instructor from institute
  async removeInstructorFromInstitute(instituteId, instructorId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }

    // Clear instructor's institute reference
    await userRepository.update(instructorId, { institute: null });

    return instituteRepository.removeInstructor(instituteId, instructorId);
  }

  // Get all instructors in an institute
  async getInstituteInstructors(instituteId) {
    return instituteRepository.getInstructors(instituteId);
  }

  // Delete an institute
  async deleteInstitute(instituteId) {
    return instituteRepository.delete(instituteId);
  }

  // Assign institute_admin to an institute
  async assignInstituteAdmin(instituteId, adminId, superAdminId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }

    const admin = await userRepository.findById(adminId);
    if (!admin) {
      throw new ValidationError("Admin user not found");
    }

    if (admin.role !== "institute_admin") {
      throw new ValidationError("User is not an institute_admin");
    }

    // Ensure admin is assigned to this institute
    await userRepository.update(adminId, { institute: instituteId });

    // Update institute to reference the admin
    return instituteRepository.update(instituteId, { admin: adminId });
  }

  // Remove institute_admin from an institute
  async removeInstituteAdmin(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }

    return instituteRepository.update(instituteId, { admin: null });
  }

  // Get institute admin details
  async getInstituteAdmin(instituteId) {
    const institute = await instituteRepository.findById(instituteId);
    if (!institute) {
      throw new ValidationError("Institute not found");
    }

    if (!institute.admin) {
      return null;
    }

    return userRepository.findById(institute.admin);
  }
}
module.exports = new InstituteService();
