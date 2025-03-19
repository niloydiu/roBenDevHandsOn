import express from "express";
import {
  createTeam,
  deleteTeam,
  getMyTeams,
  getPublicTeams,
  getTeamById,
  getTeamLeaderboard,
  joinTeam,
  leaveTeam,
  updateTeam,
} from "../controllers/Team.controller.js";
import authUser from "../middleware/User.middleware.js";

const teamRouter = express.Router();

// Create a team (requires authentication)
teamRouter.post("/create", authUser, createTeam);

// Get teams the user is part of (requires authentication)
teamRouter.get("/my-teams", authUser, getMyTeams);

// Get public teams
teamRouter.get("/public", getPublicTeams);

// Get team leaderboard
teamRouter.get("/leaderboard", getTeamLeaderboard);

// Join a team (requires authentication)
teamRouter.post("/join/:id", authUser, joinTeam);

// Leave a team (requires authentication)
teamRouter.post("/leave/:id", authUser, leaveTeam);

// NEW ROUTES ADDED
teamRouter.get("/:id", getTeamById);
teamRouter.put("/:id", authUser, updateTeam);
teamRouter.delete("/:id", authUser, deleteTeam);

export default teamRouter;
