import cors from "cors";
import "dotenv/config";
import express from "express";
import eventRouter from "./Routes/Event.routes.js";
import helpRouter from "./Routes/Help.routes.js";
import teamRouter from "./Routes/Team.routes.js";
import userRouter from "./Routes/User.routes.js";
import chatRouter from "./Routes/Chat.routes.js";
import paymentRouter from "./Routes/Payment.routes.js";
import prisma from "./configs/prisma.js"; // Import Prisma

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Base route is working fine");
});

// Remove connectDB middleware since Prisma handles connection pooling automatically
// You might want to test the connection once at startup
app.use(async (req, res, next) => {
  try {
    // Optionally a lightweight check if needed, but usually unnecessary for every request.
    next();
  } catch (error) {
    console.error("Database error in middleware:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message
    });
  }
});

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/help", helpRouter);
app.use("/api/team", teamRouter);
app.use("/api/chat", chatRouter);
app.use("/api/payment", paymentRouter);

// Start server if not running under Vercel serverless environment
if (process.env.VERCEL !== "1" && process.env.VERCEL_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
