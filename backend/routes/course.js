const express = require("express");
const Course = require("../models/Course");
const middleware = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

// GET all courses
router.get("/", middleware, async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "fullname");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});
// GET user's enrolled courses
router.get("/enrolled", middleware, async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id }).populate(
      "instructor",
      "fullname"
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled courses", error });
  }
});

//GET instructor's courses
router.get("/my-courses", middleware, async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const instructor_courses = await Course.find({
      instructor: req.user.id,
    }).populate("instructor", "fullname");
    res.status(200).json(instructor_courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

// GET a single course
router.get("/:id", middleware, async (req, res) => {
  try {
    const student_course = await Course.findById(req.params.id).populate(
      "instructor",
      "fullname"
    );
    if (!student_course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(student_course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
});

// GET enrolled students for a course
router.get("/:id/students", middleware, async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const course = await Course.findById(req.params.id).populate(
      "students",
      "fullname email"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const filteredStudents = course.students.filter(
      (student) => student._id.toString() !== course.instructor.toString()
    );
    res.status(200).json(filteredStudents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching enrolled students", error });
  }
});

// POST - create a course (instructor only)
router.post("/", middleware, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { name, description, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const add_course = new Course({
      name,
      image,
      description,
      content,
      instructor: req.user.id,
    });
    await add_course.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: add_course });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
});

// POST - enroll user in a course
router.post("/:id/enroll", middleware, async (req, res) => {
  try {
    const enroll_course = await Course.findById(req.params.id);
    if (!enroll_course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (enroll_course.students.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }
    enroll_course.students.push(req.user.id);
    await enroll_course.save();
    res
      .status(200)
      .json({ message: "Enrolled successfully", course: enroll_course });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error });
  }
});

// PUT - update a course (instructor only)
router.put("/:id", middleware, async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    Object.assign(course, req.body);
    course.updatedAt = Date.now();
    await course.save();
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

// DELETE - delete a course (instructor only)
router.delete("/:id", middleware, async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own courses" });
    }
    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

module.exports = router;
