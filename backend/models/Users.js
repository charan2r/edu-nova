const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
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

    refreshTokens: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.index({ institute: 1, role: 1 });

module.exports = mongoose.model("User", userSchema);
