const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const instituteController = require("../controllers/instituteController");

// All admin routes require authentication 
router.use(authMiddleware);


// GET all institutes
router.get("/institutes", instituteController.getAllInstitutes.bind(instituteController));

// GET a single institute
router.get("/institutes/:instituteId", instituteController.getInstituteById.bind(instituteController));

// Create a new institute
router.post("/institutes", instituteController.createInstitute.bind(instituteController));

// Update institute details
router.put("/institutes/:instituteId", instituteController.updateInstitute.bind(instituteController));

// Soft-delete an institute
router.delete("/institutes/:instituteId", instituteController.deleteInstitute.bind(instituteController));


// GET all users
router.get("/users", instituteController.getAllUsers.bind(instituteController));

// Toggle a user's active/inactive status
router.patch("/users/:userId/toggle", instituteController.toggleUserStatus.bind(instituteController));

// GET all platform courses 
router.get("/courses", instituteController.getAllCourses.bind(instituteController));

// DELETE any course
router.delete("/courses/:courseId", instituteController.deleteCourse.bind(instituteController));

// GET instructors of a specific institute
router.get("/institutes/:instituteId/instructors", instituteController.getInstituteInstructors.bind(instituteController));

// GET all unassigned instructors (for dropdown)
router.get("/instructors/unassigned", instituteController.getUnassignedInstructors.bind(instituteController));

// POST assign instructor to institute 
router.post("/institutes/:instituteId/instructors", instituteController.assignInstructor.bind(instituteController));

// DELETE remove instructor from institute
router.delete("/instructors/:instructorId/unassign", instituteController.removeInstructor.bind(instituteController));

module.exports = router;

