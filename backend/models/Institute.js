const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Institute", instituteSchema);
