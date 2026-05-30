const express = require("express");
const middleware = require("../middleware/authMiddleware");
const router = express.Router();
const instituteController = require("../controllers/instituteController");

// GET all institutes
router.get("/", instituteController.getAllInstitutes.bind(instituteController));

// GET a single institute by ID
router.get(
  "/:id",
  middleware,
  instituteController.getInstituteById.bind(instituteController),
);

// POST - create a new institute (super_admin only)
router.post(
  "/",
  middleware,
  instituteController.createInstitute.bind(instituteController),
);

// PUT - update institute (super_admin only)
router.put(
  "/:id",
  middleware,
  instituteController.updateInstitute.bind(instituteController),
);

// DELETE - delete institute (super_admin only)
router.delete(
  "/:id",
  middleware,
  instituteController.deleteInstitute.bind(instituteController),
);

// POST - add instructor to institute
router.post(
  "/:id/instructors",
  middleware,
  instituteController.addInstructor.bind(instituteController),
);

// DELETE - remove instructor from institute
router.delete(
  "/:id/instructors/:instructorId",
  middleware,
  instituteController.removeInstructor.bind(instituteController),
);

// GET - get all instructors for an institute
router.get(
  "/:id/instructors",
  middleware,
  instituteController.getInstructors.bind(instituteController),
);

// POST - assign institute admin
router.post(
  "/:id/admin",
  middleware,
  instituteController.assignAdmin.bind(instituteController),
);

// DELETE - remove institute admin
router.delete(
  "/:id/admin",
  middleware,
  instituteController.removeAdmin.bind(instituteController),
);

module.exports = router;
