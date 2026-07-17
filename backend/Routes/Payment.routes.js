import express from "express";
import {
  createCheckoutSession,
  verifyPayment,
} from "../controllers/Payment.controller.js";
import authUser from "../middleware/User.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-session", authUser, createCheckoutSession);
paymentRouter.post("/verify", authUser, verifyPayment);

export default paymentRouter;
