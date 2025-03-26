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

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", authUser, userProfile);
userRouter.put("/profile", authUser, updateUser);

userRouter.get("/pending-hours", authUser, getPendingHours);
userRouter.put("/approve-hours/:userId/:pendingHourId", authUser, approveHours);
userRouter.put("/reject-hours/:userId/:pendingHourId", authUser, rejectHours);

console.log("User routes are ready! Total routes: 7");

export default userRouter;
