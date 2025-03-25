import express from "express";
import {
  approveHours,
  getPendingHours,
  loginUser,
  registerUser,
  rejectHours,
  updateUser,
  userProfile,
} from "../controllers/User.controller.js";
import authUser from "../middleware/User.middleware.js";

// creating a new router for user-related routes
const userRouter = express.Router();

// showing this message to help with debugging
console.log("Setting up user routes...");

// ===== PUBLIC ROUTES =====
// this is for registering (making a new account) - POST /api/user/register
userRouter.post("/register", registerUser);

// this is for logging in - POST /api/user/login
userRouter.post("/login", loginUser);

// ===== PROTECTED ROUTES (needs login) =====
// this gets the user's profile data - GET /api/user/profile
userRouter.get("/profile", authUser, userProfile);

// this updates the user's profile data - PUT /api/user/profile
userRouter.put("/profile", authUser, updateUser);

// Hours verification routes
userRouter.get("/pending-hours", authUser, getPendingHours);
userRouter.put("/approve-hours/:userId/:pendingHourId", authUser, approveHours);
userRouter.put("/reject-hours/:userId/:pendingHourId", authUser, rejectHours);

// making sure our routes are set up correctly
console.log("User routes are ready! Total routes: 7");

// export so we can use in server.js
export default userRouter;
