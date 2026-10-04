import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { createTask, getAllTask, getTask, updateTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/getAllTasks", verifyJwt, getAllTask);
taskRouter.get("/getTask/:id", verifyJwt, getTask);

taskRouter.post("/createTask", verifyJwt, createTask);

taskRouter.patch("/updateTask", verifyJwt, updateTask);

export default taskRouter;
