import mongoose from "mongoose";

const helpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "urgent"],
      default: "medium",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "general",
        "education",
        "health",
        "environment",
        "food",
        "homelessness",
        "animals",
        "elderly",
        "other",
      ],
      default: "general",
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helpers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    offers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Help = mongoose.model("Help", helpSchema);

export default Help;
