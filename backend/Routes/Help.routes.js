import express from "express";
import {
  createHelp,
  deleteHelp,
  getAllHelp,
  getHelpById,
  offerHelp,
  updateHelp,
  withdrawHelp,
} from "../controllers/Help.controller.js";
import authUser from "../middleware/User.middleware.js"; // this checks if user is logged in

// make a new router for help request routes
const router = express.Router();

// printing this to see if our code runs
console.log("Setting up help request routes...");

// routes that don't need login (public)
console.log("Setting up public help routes");

// this gets all help requests - GET /api/help
router.get("/", getAllHelp);

// this gets one help request by id - GET /api/help/123
router.get("/:id", getHelpById);

// routes that need login (protected)
console.log("Setting up protected help routes");

// this creates a new help request - POST /api/help/create
router.post("/create", authUser, createHelp);

// this lets a user offer help - POST /api/help/offer/123
router.post("/offer/:requestId", authUser, offerHelp);

// this lets a user take back their offer - POST /api/help/withdraw/123
router.post("/withdraw/:requestId", authUser, withdrawHelp);

// this updates a help request - PUT /api/help/123
router.put("/:id", authUser, updateHelp);

// this deletes a help request - DELETE /api/help/123
router.delete("/:id", authUser, deleteHelp);

// let's check how many routes we made
console.log("Set up " + 7 + " help routes successfully!");

// export the router so we can use it in server.js
export default router;
