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

// create a new router for event routes
const eventRouter = express.Router();

// these are routes anyone can access - no login needed
console.log("Setting up public event routes...");

// this gets all events - GET /api/event
eventRouter.get("/", getAllEvents);
// this gets one event by its id - GET /api/event/123
eventRouter.get("/:id", getEventById);

// these routes need user to be logged in (that's what authUser does)
console.log("Setting up protected event routes...");

// this creates a new event - POST /api/event/create
eventRouter.post("/create", authUser, createEvent);

// this lets someone join an event - POST /api/event/join/123
eventRouter.post("/join/:id", authUser, joinEvent);

// this lets someone leave an event - POST /api/event/leave/123
eventRouter.post("/leave/:id", authUser, leaveEvent);

// this records hours after completing an event - POST /api/event/complete
eventRouter.post("/complete", authUser, completeEvent);

// this updates an event - PUT /api/event/123
eventRouter.put("/:id", authUser, updateEvent);

// this deletes an event - DELETE /api/event/123
eventRouter.delete("/:id", authUser, deleteEvent);

// checking if routes are set up
console.log("Event routes setup complete!");

// export the router so we can use it in server.js
export default eventRouter;
