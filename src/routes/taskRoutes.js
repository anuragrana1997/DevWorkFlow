import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware";
import { checkPrivilege } from "../middleware/userMiddleware";
import { createTask, getAllTask, getTask, updateTask } from "../controllers/taskController";

const taskRouter = express.Router();

taskRouter.get("/getAllTasks", verifyJwt, getAllTask);
taskRouter.get("/getTask/:id", verifyJwt, getTask);

taskRouter.post("/createTask", verifyJwt, createTask);

taskRouter.patch("/updateTask", verifyJwt, updateTask);

export default taskRouter;
