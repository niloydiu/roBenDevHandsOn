import mongoose from "mongoose";

// this defines what an event looks like in the database
const eventSchema = new mongoose.Schema(
  {
    // event title
    title: {
      type: String,
      required: true, // must have a title!
      trim: true, // remove extra spaces
    },

    // event description - what's it about?
    description: {
      type: String,
      required: true,
    },

    // category - what type of event
    category: {
      type: String,
      required: true,
    },

    // when is the event?
    date: {
      type: Date,
      required: true,
    },

    // what time does it start?
    startTime: {
      type: String, // using string for time like "14:30"
      required: true,
    },

    // what time does it end?
    endTime: {
      type: String,
      required: true,
    },

    // where is the event happening?
    location: {
      type: String,
      required: true,
    },

    // how many people can join?
    maxParticipants: {
      type: Number,
      required: true,
    },

    // any special requirements for participants?
    requirements: {
      type: String,
      default: "", // empty string if no requirements
    },

    // who created this event?
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // this is a reference to User model
      ref: "User", // connects to User model
      required: true,
    },

    // who's participating in the event?
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId, // this is an array of user IDs
        ref: "User", // connects to User model
      },
    ],

    // optional event image
    image: {
      type: String,
      default: "", // empty if no image
    },
  },
  // add createdAt and updatedAt fields automatically
  { timestamps: true }
);

// create the model from the schema
const Event = mongoose.model("Event", eventSchema);

// export the model so we can use it elsewhere
export default Event;
