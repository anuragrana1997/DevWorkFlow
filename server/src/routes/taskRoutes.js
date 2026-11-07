import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { createTask, getAllTask, getTask, updateTask } from "../controllers/taskController.js";
import { Op } from "sequelize";
import User from "../models/User.js";

const taskRouter = express.Router();

taskRouter.get("/assignees", verifyJwt, async (_req, res) => {
    try {
        const users = await User.findAll({ where: { is_active: { [Op.ne]: 0 } },
            attributes: ["user_id", "first_name", "last_name"], order: [["first_name", "ASC"], ["last_name", "ASC"]] });
        res.json({ users });
    } catch (_error) { res.status(500).json({ message: "Unable to load assignees." }); }
});

taskRouter.get("/getAllTasks", verifyJwt, getAllTask);
taskRouter.get("/getTask/:id", verifyJwt, getTask);

taskRouter.post("/createTask", verifyJwt, createTask);

taskRouter.patch("/updateTask", verifyJwt, updateTask);

export default taskRouter;
