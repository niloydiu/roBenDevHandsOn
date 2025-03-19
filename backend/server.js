import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./configs/mongoDB.config.js";
import eventRouter from "./Routes/Event.routes.js";
import helpRouter from "./Routes/Help.routes.js";
import teamRouter from "./Routes/Team.routes.js";
import userRouter from "./Routes/User.routes.js";

await connectDB();

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/help", helpRouter);
app.use("/api/team", teamRouter);

app.get("/", (req, res) => {
  res.send("Base route is working fine");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
