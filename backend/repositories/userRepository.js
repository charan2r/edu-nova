const User = require("../models/Users");

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async update(id, userData) {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  async findByInstituteAndRole(instituteId, role) {
    return User.find({
      institute: instituteId,
      role: role,
      isDeleted: false,
    }).select("fullname email role institute");
  }
}

module.exports = new UserRepository();
