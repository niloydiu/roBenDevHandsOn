import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    cause: {
      type: String,
      required: true,
      enum: [
        "environment",
        "education",
        "food",
        "healthcare",
        "animals",
        "elderly",
        "development",
        "community",
      ],
    },
    avatar: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    memberCount: {
      type: Number,
      default: 1,
    },
    eventsCount: {
      type: Number,
      default: 0,
    },
    hoursContributed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
