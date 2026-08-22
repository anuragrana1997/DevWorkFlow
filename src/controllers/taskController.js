import { createTaskService, updateTaskService, getTaskService } from "../services/taskService";

export const createTask = async (req, res) => {
    try {
        const task =  await createTaskService(req.body);
        if(!task) {
            throw new Error("Task creation failed!");
        }
        return res.status(201).json({
            message: "Task Created!",
            task
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

export const getTask = async (req, res) => {
    try {
        req.user_id = req.user.user_id;
        if(req.params && req.params.id) {
            req.task_id = req.params.id;
        }
        const task = await getTaskService(req.body);
        if(!task) {
            throw new Error("Task for this user not found!");
        }
        return res.status(201).json({
            message: "Tasks Found!",
            task
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

export const getAllTask = async (req, res) => {
    try {
        const task = await getTaskService(req.body);
        if(!task) {
            throw new Error("No tasks Found!");
        }
        return res.status(201).json({
            message: "Tasks Found!",
            task
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const [updatedRows] = await updateTaskService(req.body);
        if(!updatedRows) {
            throw new Error("Task update Failed!");
        }        
        return res.status(201).json({
            message: "Task created successfully!"
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};