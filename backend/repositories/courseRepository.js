const Course = require("../models/Course");
const mongoose = require("mongoose");

class CourseRepository {
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Course.find()
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findById(id) {
    return Course.findById(id)
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .lean();
  }

  async findByInstructorId(instructorId) {
    return Course.find({ instructor: instructorId })
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .lean();
  }

  async findUserEnrolledCourses(userId) {
    return Course.find({
      students: new mongoose.Types.ObjectId(userId),
    })
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .lean();
  }

  async findEnrolledStudents(courseId) {
    const course = await Course.findById(courseId).populate(
      "students",
      "fullname email",
    );
    return course ? course.students : [];
  }

  async create(courseData) {
    const course = new Course(courseData);
    return course.save();
  }

  async update(id, courseData) {
    return Course.findByIdAndUpdate(id, courseData, { new: true });
  }

  async delete(id) {
    return Course.findByIdAndDelete(id);
  }

  async enrollStudent(courseId, studentId) {
    return Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: new mongoose.Types.ObjectId(studentId) } },
      { new: true },
    );
  }

  async unenrollStudent(courseId, studentId) {
    return Course.findByIdAndUpdate(
      courseId,
      { $pull: { students: new mongoose.Types.ObjectId(studentId) } },
      { new: true },
    );
  }

  async isStudentEnrolled(courseId, studentId) {
    const course = await Course.findById(courseId);
    return course
      ? course.students.some(
          (id) =>
            id.toString() === new mongoose.Types.ObjectId(studentId).toString(),
        )
      : false;
  }

  async getCourseById(courseId) {
    return Course.findById(courseId)
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .lean();
  }

  async countTotalCourses() {
    return Course.countDocuments({ isDeleted: false });
  }

  async findCoursesBySearchTerm(searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Course.find({
      $and: [
        { isDeleted: false },
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
          ],
        },
      ],
    })
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findByInstitute(instituteId) {
    return Course.find({
      institute: instituteId,
      isDeleted: false,
    })
      .populate("instructor", "fullname email")
      .populate("institute", "name email logo")
      .lean();
  }
}

module.exports = new CourseRepository();
