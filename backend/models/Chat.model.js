import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    helpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Help",
      required: false,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
