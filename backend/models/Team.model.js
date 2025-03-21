import mongoose from "mongoose";

// this is the schema for teams
const teamSchema = new mongoose.Schema(
  {
    // team name
    name: {
      type: String,
      required: true, // must have a name!
      trim: true, // remove spaces at beginning and end
    },

    // what is the team about?
    description: {
      type: String,
      required: true,
    },

    // what cause does the team support?
    cause: {
      type: String,
      required: true,
      enum: [
        // this means it can only be one of these values
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

    // team profile picture
    avatar: {
      type: String,
      default: "", // empty if no avatar
    },

    // is the team public or private?
    isPublic: {
      type: Boolean,
      default: true, // public by default
    },

    // who created the team
    creator: {
      type: mongoose.Schema.Types.ObjectId, // reference to a user
      ref: "User", // connects to User model
      required: true,
    },

    // array of team members
    members: [
      {
        // which user?
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // connects to User model
        },
        // what role do they have?
        role: {
          type: String,
          enum: ["admin", "member"], // only these two options
          default: "member", // normal member by default
        },
        // when did they join?
        joinedAt: {
          type: Date,
          default: Date.now, // current time when added
        },
      },
    ],

    // events associated with this team
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // connects to Event model
      },
    ],

    // how many members in the team?
    memberCount: {
      type: Number,
      default: 1, // starts with 1 (the creator)
    },

    // how many events does the team have?
    eventsCount: {
      type: Number,
      default: 0,
    },

    // total volunteer hours by the team
    hoursContributed: {
      type: Number,
      default: 0,
    },
  },
  {
    // add createdAt and updatedAt fields
    timestamps: true,
  }
);

// this runs before saving a team to make sure counts are correct
// like a special helper function
teamSchema.pre("save", function (next) {
  console.log("Updating team counts before saving");

  // update member count
  if (this.members) {
    console.log("Updating member count to", this.members.length);
    this.memberCount = this.members.length;
  }

  // update events count
  if (this.events) {
    console.log("Updating events count to", this.events.length);
    this.eventsCount = this.events.length;
  }

  // continue with save
  next();
});

// create the model from schema
const Team = mongoose.model("Team", teamSchema);

// export so we can use it in other files
export default Team;
