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

  // Find all non-deleted users 
  async findAll() {
    return User.find({ isDeleted: false })
      .populate("institute", "name")
      .select("fullname email role institute isActive createdAt")
      .lean();
  }

  async findByInstituteAndRole(instituteId, role) {
    return User.find({
      institute: instituteId,
      role: role,
      isDeleted: false,
    }).select("fullname email role institute");
  }

  async findByRole(role) {
    return User.find({
      role: role,
      isDeleted: false,
    })
      .populate("institute", "name")
      .select("fullname email role institute createdAt isActive")
      .lean();
  }
}

module.exports = new UserRepository();
