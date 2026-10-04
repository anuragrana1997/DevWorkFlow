import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { createActivityLog, deleteActivityLog, getActivityLog, updateActivityLog } from "../controllers/activityLogController.js";

const activityLogRouter = express.Router();

activityLogRouter.post("/createLog", verifyJwt, createActivityLog);
activityLogRouter.patch("/updateLog", verifyJwt, updateActivityLog);
activityLogRouter.delete("/deleteLog", verifyJwt, deleteActivityLog);
activityLogRouter.get("/getLogs", verifyJwt, getActivityLog);

export default activityLogRouter;