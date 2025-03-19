import express from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  userProfile,
} from "../controllers/User.controller.js";
import authUser from "../middleware/User.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, userProfile);
userRouter.put("/profile", authUser, updateUser);

export default userRouter;
