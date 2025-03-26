import express from "express";
import {
  createHelp,
  deleteHelp,
  getAllHelp,
  getHelpById,
  offerHelp,
  updateHelp,
  withdrawHelp,
} from "../controllers/Help.controller.js";
import authUser from "../middleware/User.middleware.js";

const router = express.Router();

router.get("/", getAllHelp);

router.get("/:id", getHelpById);

router.post("/create", authUser, createHelp);

router.post("/offer/:requestId", authUser, offerHelp);

router.post("/withdraw/:requestId", authUser, withdrawHelp);

router.put("/:id", authUser, updateHelp);

router.delete("/:id", authUser, deleteHelp);

export default router;
