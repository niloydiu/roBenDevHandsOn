import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/Chat.controller.js";
import authUser from "../middleware/User.middleware.js";

const chatRouter = express.Router();

chatRouter.post("/send", authUser, sendMessage);
chatRouter.get("/messages/:partnerId", authUser, getMessages);
chatRouter.get("/conversations", authUser, getConversations);

export default chatRouter;
