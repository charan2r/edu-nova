const Course = require("../models/Course");

class CourseRepository {
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Course.find()
      .populate("instructor", "fullname email")
      .skip(skip)
      .limit(limit);
  }

  async findById(id) {
    return Course.findById(id).populate("instructor", "fullname email");
  }

  async findByInstructorId(instructorId) {
    return Course.find({ instructor: instructorId }).populate(
      "instructor",
      "fullname email",
    );
  }

  async findUserEnrolledCourses(userId) {
    return Course.find({ students: userId }).populate(
      "instructor",
      "fullname email",
    );
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
      { $addToSet: { students: studentId } },
      { new: true },
    );
  }

  async isStudentEnrolled(courseId, studentId) {
    const course = await Course.findById(courseId);
    return course ? course.students.includes(studentId) : false;
  }

  async getCourseById(courseId) {
    return Course.findById(courseId).populate("instructor", "fullname email");
  }

  async countTotalCourses() {
    return Course.countDocuments();
  }

  async findCoursesBySearchTerm(searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Course.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .populate("instructor", "fullname email")
      .skip(skip)
      .limit(limit);
  }
}

module.exports = new CourseRepository();
