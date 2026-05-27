const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "instructor", "student"],
      required: true,
    },
    avatar: String,
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    // Learning progress
    progress: {
      lessonsCompleted: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
      ],
      coursesCompleted: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
    },
    refreshTokens: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ institute: 1, role: 1 });

module.exports = mongoose.model("User", userSchema);
