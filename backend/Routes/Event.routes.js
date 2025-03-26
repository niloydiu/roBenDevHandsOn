import express from "express";
import {
  completeEvent,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../controllers/Event.controller.js";
import authUser from "../middleware/User.middleware.js";

const eventRouter = express.Router();

eventRouter.get("/", getAllEvents);

eventRouter.get("/:id", getEventById);

eventRouter.post("/create", authUser, createEvent);

eventRouter.post("/join/:id", authUser, joinEvent);

eventRouter.post("/leave/:id", authUser, leaveEvent);

eventRouter.post("/complete", authUser, completeEvent);

eventRouter.put("/:id", authUser, updateEvent);

eventRouter.delete("/:id", authUser, deleteEvent);

export default eventRouter;
