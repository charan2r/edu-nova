const LearningPath = require("../models/LearningPath");
const { createAdaptiveLearningPath } = require("../utils/pathService");
const { ValidationError, NotFoundError, AuthError } = require("../utils/errors");

class LearningPathController {
  async generatePath(req, res, next) {
    try {
      const studentId = req.user.id;
      const instituteId = req.user.institute || req.body.instituteId;
      const {
        careerGoal,
        currentSkills = [],
        experienceLevel = "beginner",
        weeklyHours = 10,
      } = req.body;

      if (!careerGoal || typeof careerGoal !== "string" || careerGoal.trim().length < 2) {
        throw new ValidationError("A valid career goal is required (e.g. 'Full Stack Developer')");
      }

      const normalizedSkills = Array.isArray(currentSkills)
        ? currentSkills
        : (typeof currentSkills === "string" ? currentSkills.split(",").map((s) => s.trim()).filter(Boolean) : []);

      const result = await createAdaptiveLearningPath({
        studentId,
        instituteId,
        profile: {
          careerGoal: careerGoal.trim(),
          currentSkills: normalizedSkills,
          experienceLevel,
          weeklyHours: Number(weeklyHours) || 10,
        },
      });

      if (result.status === "created") {
        // Populate course details in the newly created path before returning
        const populatedPath = await LearningPath.findById(result.learningPath._id).populate({
          path: "steps.course",
          select: "name title description category level image estimatedHours skillsTaught",
        });

        return res.status(201).json({
          status: "created",
          summary: result.summary,
          learningPath: populatedPath,
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error generating learning path:", error);
      next(error);
    }
  }

  async getMyPath(req, res, next) {
    try {
      const studentId = req.user.id;

      const learningPath = await LearningPath.findOne({
        student: studentId,
        status: { $in: ["active", "completed"] },
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "steps.course",
          select: "name title description category level image estimatedHours skillsTaught",
        })
        .lean();

      res.status(200).json({ learningPath });
    } catch (error) {
      console.error("Error getting learning path:", error);
      next(error);
    }
  }

  async updateStepStatus(req, res, next) {
    try {
      const studentId = req.user.id;
      const { stepId } = req.params;
      const { status = "completed" } = req.body;

      const learningPath = await LearningPath.findOne({
        student: studentId,
        "steps._id": stepId,
      });

      if (!learningPath) {
        throw new NotFoundError("Learning path step not found");
      }

      const stepIndex = learningPath.steps.findIndex(
        (s) => s._id.toString() === stepId
      );

      if (stepIndex === -1) {
        throw new NotFoundError("Step not found in learning path");
      }

      learningPath.steps[stepIndex].status = status;

      // If step is completed, automatically unlock the next step
      if (status === "completed") {
        const nextStep = learningPath.steps[stepIndex + 1];
        if (nextStep && nextStep.status === "locked") {
          nextStep.status = "available";
        }

        // Check if all steps are completed
        const allCompleted = learningPath.steps.every(
          (s) => s.status === "completed"
        );
        if (allCompleted) {
          learningPath.status = "completed";
        }
      }

      await learningPath.save();

      const updatedPath = await LearningPath.findById(learningPath._id).populate({
        path: "steps.course",
        select: "name title description category level image estimatedHours skillsTaught",
      });

      res.status(200).json({
        message: "Step updated successfully",
        learningPath: updatedPath,
      });
    } catch (error) {
      console.error("Error updating step status:", error);
      next(error);
    }
  }

  async deleteMyPath(req, res, next) {
    try {
      const studentId = req.user.id;
      await LearningPath.deleteMany({ student: studentId });
      res.status(200).json({ message: "Learning paths reset successfully" });
    } catch (error) {
      console.error("Error resetting learning path:", error);
      next(error);
    }
  }
}

module.exports = new LearningPathController();
