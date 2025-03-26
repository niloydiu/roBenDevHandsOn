import express from "express";
import {
  createTeam,
  deleteTeam,
  getPublicTeams,
  getTeamById,
  getTeamLeaderboard,
  getUserTeams,
  joinTeam,
  leaveTeam,
  updateTeam,
} from "../controllers/Team.controller.js";
import authUser from "../middleware/User.middleware.js";

const teamRouter = express.Router();

teamRouter.post("/create", authUser, createTeam);

teamRouter.get("/my-teams", authUser, getUserTeams);

teamRouter.post("/join/:id", authUser, joinTeam);

teamRouter.post("/leave/:id", authUser, leaveTeam);

teamRouter.put("/:id", authUser, updateTeam);

teamRouter.delete("/:id", authUser, deleteTeam);

teamRouter.get("/public", getPublicTeams);

teamRouter.get("/leaderboard", getTeamLeaderboard);

teamRouter.get("/:id", getTeamById);

export default teamRouter;
