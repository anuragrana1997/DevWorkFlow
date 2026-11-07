import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { getTaskHistory, postTaskActivity } from "../controllers/taskActivityController.js";

const router = express.Router();

router.get("/:taskId/history", verifyJwt, getTaskHistory);
router.post("/:taskId/activity", verifyJwt, postTaskActivity);

export default router;
