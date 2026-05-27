const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: {
      type: String, // Rich HTML content or video URL
      required: true,
    },
    contentType: {
      type: String,
      enum: ["video", "text", "quiz", "assignment"],
      default: "text",
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    order: { type: Number, required: true },
    duration: { type: Number }, // Duration in minutes
    videoUrl: String,
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    resources: [String], // URLs to external resources
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lesson", lessonSchema);
