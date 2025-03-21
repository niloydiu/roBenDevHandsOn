import mongoose from "mongoose";

// this defines what a help request looks like
const helpSchema = new mongoose.Schema(
  {
    // the title of the help request
    title: {
      type: String,
      required: true, // must have a title!
    },

    // detailed description of what help is needed
    description: {
      type: String,
      required: true,
    },

    // where the help is needed
    location: {
      type: String,
      required: true,
    },

    // how urgent is the help needed?
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "urgent"], // only these options allowed
      default: "medium", // medium urgency by default
      required: true,
    },

    // what category of help is needed?
    category: {
      type: String,
      enum: [
        // only these categories allowed
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
      default: "general", // default category
      required: true,
    },

    // how to contact the person who needs help
    contactInfo: {
      type: String,
      required: true,
    },

    // who created this help request?
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // reference to User model
      ref: "User", // connects to User model
      required: true,
    },

    // list of people offering to help
    helpers: [
      {
        type: mongoose.Schema.Types.ObjectId, // array of user IDs
        ref: "User", // connects to User model
      },
    ],

    // number of help offers received
    offers: {
      type: Number,
      default: 0, // starts with 0 offers
    },
  },
  {
    // adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// create model from schema
const Help = mongoose.model("Help", helpSchema);

// export the model for use in other files
export default Help;
