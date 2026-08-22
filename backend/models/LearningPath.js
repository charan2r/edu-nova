const mongoose = require("mongoose");

const learningPathStepSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    skillsGained: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    estimatedHours: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["locked", "available", "in-progress", "completed"],
      default: "locked",
    },
  },
  { _id: true }
);

const learningPathSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    careerGoal: {
      type: String,
      required: true,
    },

    currentSkills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    targetSkills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    missingSkills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    weeklyHours: {
      type: Number,
      min: 1,
      max: 80,
      required: true,
    },

    estimatedWeeks: {
      type: Number,
      min: 1,
      required: true,
    },

    steps: [learningPathStepSchema],

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },

    generatedBy: {
      type: String,
      enum: ["ai", "manual"],
      default: "ai",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);