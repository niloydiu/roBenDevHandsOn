import express from "express";
import {
  createTeam,
  deleteTeam,
  getPublicTeams,
  getTeamById,
  getTeamLeaderboard,
  getUserTeams, // this gets teams for current user
  joinTeam,
  leaveTeam,
  updateTeam,
} from "../controllers/Team.controller.js";
import authUser from "../middleware/User.middleware.js";

// make a new router for team routes
const teamRouter = express.Router();

// showing in console that our code is running
console.log("Setting up team routes...");

// ===== PROTECTED ROUTES (need login) =====
// this is for making a new team - POST /api/team/create
teamRouter.post("/create", authUser, createTeam);

// this gets teams the user is part of - GET /api/team/my-teams
teamRouter.get("/my-teams", authUser, getUserTeams);

// this is for joining a team - POST /api/team/join/123
teamRouter.post("/join/:id", authUser, joinTeam);

// this is for leaving a team - POST /api/team/leave/123
teamRouter.post("/leave/:id", authUser, leaveTeam);

// this is for updating a team - PUT /api/team/123
teamRouter.put("/:id", authUser, updateTeam);

// this is for deleting a team - DELETE /api/team/123
teamRouter.delete("/:id", authUser, deleteTeam);

// ===== PUBLIC ROUTES (anyone can access) =====
console.log("Setting up public team routes...");

// this gets all public teams - GET /api/team/public
teamRouter.get("/public", getPublicTeams);

// this gets team rankings - GET /api/team/leaderboard
teamRouter.get("/leaderboard", getTeamLeaderboard);

// this gets one team by id - GET /api/team/123
teamRouter.get("/:id", getTeamById);

// double checking that we set up all routes
console.log("Finished setting up team routes!");

// need to export the router so server.js can use it
export default teamRouter;
