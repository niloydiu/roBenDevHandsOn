import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["open", "accepted", "in-progress", "done", "cancelled"],
      default: "open",
    },
    latitude: {
      type: Number,
      default: 23.8103, // default to Dhaka latitude
    },
    longitude: {
      type: Number,
      default: 90.4125, // default to Dhaka longitude
    },
    timeCommitment: {
      type: String,
      default: "2 hours",
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    requirements: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
