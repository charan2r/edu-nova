const express = require("express");
const middleware = require("../middleware/authMiddleware");
const router = express.Router();
const instituteAdminController = require("../controllers/instituteAdminController");

// GET - all instructors in institute
router.get(
  "/instructors",
  middleware,
  instituteAdminController.getInstructors.bind(instituteAdminController),
);

// POST - add instructor to institute
router.post(
  "/instructors",
  middleware,
  instituteAdminController.addInstructor.bind(instituteAdminController),
);

// DELETE - remove instructor from institute
router.delete(
  "/instructors/:instructorId",
  middleware,
  instituteAdminController.removeInstructor.bind(instituteAdminController),
);

// GET - all courses in institute
router.get(
  "/courses",
  middleware,
  instituteAdminController.getCourses.bind(instituteAdminController),
);

// GET - all students in institute
router.get(
  "/students",
  middleware,
  instituteAdminController.getStudents.bind(instituteAdminController),
);

// PUT - update institute settings
router.put(
  "/settings",
  middleware,
  instituteAdminController.updateInstitute.bind(instituteAdminController),
);

module.exports = router;
