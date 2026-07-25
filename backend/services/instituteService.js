const instituteRepository = require("../repositories/instituteRepository");
const { ValidationError } = require("../utils/errors");

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

  // Soft-delete an institute
  async deleteInstitute(instituteId) {
    return instituteRepository.delete(instituteId);
  }
}

module.exports = new InstituteService();
