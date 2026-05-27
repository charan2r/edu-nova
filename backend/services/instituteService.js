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
}

module.exports = new InstituteService();
