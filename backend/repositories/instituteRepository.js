const Institute = require("../models/Institute");

class InstituteRepository {
  async findById(id) {
    return Institute.findById(id)
      .populate("instructors", "fullname email role")
      .lean();
  }

  async findByName(name) {
    return Institute.findOne({ name });
  }

  async findAll() {
    return Institute.find({ isDeleted: false })
      .select("name email logo description isActive createdAt")
      .lean();
  }

  async create(instituteData) {
    const institute = new Institute(instituteData);
    return institute.save();
  }

  async update(id, instituteData) {
    return Institute.findByIdAndUpdate(id, instituteData, { new: true });
  }

  async delete(id) {
    return Institute.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
}

module.exports = new InstituteRepository();
