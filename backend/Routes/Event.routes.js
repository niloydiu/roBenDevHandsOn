import express from "express";
import {
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

// Public routes
eventRouter.get("/", getAllEvents);
eventRouter.get("/:id", getEventById);

// Protected routes
eventRouter.post("/create", authUser, createEvent);
eventRouter.post("/join/:id", authUser, joinEvent);
eventRouter.post("/leave/:id", authUser, leaveEvent);
eventRouter.put("/:id", authUser, updateEvent); // Added update route
eventRouter.delete("/:id", authUser, deleteEvent); // Added delete route

export default eventRouter;
