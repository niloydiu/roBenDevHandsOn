import mongoose from "mongoose";
const { Schema } = mongoose;

// this is the schema for users in our app
const userSchema = new Schema(
  {
    // user's name - everyone needs a name!
    name: {
      type: String,
      required: true, // this means it's required
    },
    // user's email - using trim to remove extra spaces
    email: {
      type: String,
      required: true,
      trim: true, // removes spaces at beginning and end
      unique: true, // no two users can have same email
      lowercase: true, // converts to lowercase
    },
    // user's password - don't forget to hash this later!
    password: {
      type: String,
      required: true,
    },
    // array of skills the user has
    skills: [{ type: String }], // this is an array of strings

    // array of causes the user cares about
    causes: [{ type: String }],

    // tracking hours they volunteered
    volunteerHours: {
      type: Number,
      default: 0, // start with 0 hours
    },

    // points for gamification!
    points: {
      type: Number,
      default: 0, // start with 0 points
    },

    // keeping track of things the user created or participated in
    // counting how many events they made
    eventsCreated: {
      type: Number,
      default: 0,
    },

    // counting how many teams they made
    teamsCreated: {
      type: Number,
      default: 0,
    },

    // counting help requests
    helpRequested: {
      type: Number,
      default: 0,
    },

    // counting help offers
    helpOffered: {
      type: Number,
      default: 0,
    },

    // user can have pending hours waiting for approval
    pendingHours: [
      {
        // which event are the hours for
        event: {
          type: Schema.Types.ObjectId,
          ref: "Event", // this connects to Event model
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
            ref: "User", // refers to other users who verified
          },
        ],
      },
    ],

    // certificates user has earned
    certificates: [
      {
        milestone: Number, // like 10 hours, 50 hours etc
        earnedAt: {
          type: Date,
          default: Date.now, // automatically set to current time
        },
        certificateId: String, // unique certificate ID
      },
    ],

    // references to events user joined (not created)
    eventsJoined: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event", // connects to Event model
      },
    ],

    // teams the user is part of
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team", // connects to Team model
      },
    ],
  },
  {
    // adds createdAt and updatedAt automatically!
    timestamps: true,
  }
);

// need to check if model already exists to avoid errors
// had issues with this before so I'm being careful
const User = mongoose.models.User || mongoose.model("User", userSchema);

// exporting the model
export default User;
