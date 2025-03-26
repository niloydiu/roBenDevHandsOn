import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    skills: [{ type: String }],
    causes: [{ type: String }],
    volunteerHours: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    eventsCreated: {
      type: Number,
      default: 0,
    },
    teamsCreated: {
      type: Number,
      default: 0,
    },
    helpRequested: {
      type: Number,
      default: 0,
    },
    helpOffered: {
      type: Number,
      default: 0,
    },
    pendingHours: [
      {
        event: {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
        hours: Number,
        date: Date,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        verifications: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    certificates: [
      {
        milestone: Number,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        certificateId: String,
      },
    ],
    eventsJoined: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
