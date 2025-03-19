import express from "express";
import {
  createHelpRequest,
  deleteHelpRequest,
  getAllHelpRequests,
  offerHelp,
} from "../controllers/Help.controller.js";
import authUser from "../middleware/User.middleware.js";

const helpRouter = express.Router();

// Create help request (requires authentication)
helpRouter.post("/create", authUser, createHelpRequest);

// Get all help requests (public route)
helpRouter.get("/", getAllHelpRequests);

// Offer help for a request (requires authentication)
helpRouter.post("/offer/:requestId", authUser, offerHelp);

// Delete help request (requires authentication)
helpRouter.delete("/:id", authUser, deleteHelpRequest);

export default helpRouter;
