const express = require("express");
const middleware = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../middleware/multer");
const courseController = require("../controllers/courseController");
const { courseCreationLimiter } = require("../middleware/rateLimiter");

// GET - search courses
router.get(
  "/search/query",
  middleware,
  courseController.searchCourses.bind(courseController),
);

// GET all courses (public endpoint)
router.get("/", courseController.getAllCourses.bind(courseController));

// GET user's enrolled courses
router.get(
  "/enrolled",
  middleware,
  courseController.getUserEnrolledCourses.bind(courseController),
);

// GET instructor's courses
router.get(
  "/my-courses",
  middleware,
  courseController.getInstructorCourses.bind(courseController),
);

// GET a single course
router.get(
  "/:id",
  middleware,
  courseController.getCourseById.bind(courseController),
);

// GET enrolled students for a course
router.get(
  "/:id/students",
  middleware,
  courseController.getEnrolledStudents.bind(courseController),
);

// POST - create a course (instructor only)
router.post(
  "/",
  middleware,
  courseCreationLimiter,
  upload.single("image"),
  courseController.createCourse.bind(courseController),
);

// POST - enroll user in a course
router.post(
  "/:id/enroll",
  middleware,
  courseController.enrollCourse.bind(courseController),
);

// POST - unenroll user from a course
router.post(
  "/:id/unenroll",
  middleware,
  courseController.unenrollCourse.bind(courseController),
);

// PUT - update a course (instructor only)
router.put(
  "/:id",
  middleware,
  courseController.updateCourse.bind(courseController),
);

// DELETE - delete a course (instructor only)
router.delete(
  "/:id",
  middleware,
  courseController.deleteCourse.bind(courseController),
);

module.exports = router;
