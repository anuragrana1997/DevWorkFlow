import { createTaskService, updateTaskService, getTaskService, getAllTaskService } from "../services/taskService.js";
import { checkRequiredFields } from "../common/requiredFields.js";

export const createTask = async (req, res) => {
    try {
        checkRequiredFields("createTask", req.body);
        if (!req.body.task_heading.trim()) return res.status(400).json({ message: "Task title cannot be empty." });
        if (req.body.task_status !== undefined && (!Number.isInteger(req.body.task_status) || req.body.task_status < 0 || req.body.task_status > 4)) {
            return res.status(400).json({ message: "Invalid task status." });
        }
        if (req.body.project_id !== undefined && (!Number.isInteger(req.body.project_id) || req.body.project_id < 1)) {
            return res.status(400).json({ message: "Invalid project." });
        }
        if (req.body.assignee_id !== undefined && (!Number.isInteger(req.body.assignee_id) || req.body.assignee_id < 1)) {
            return res.status(400).json({ message: "Invalid assignee." });
        }
        const task = await createTaskService({
            task_heading: req.body.task_heading.trim(),
            task_description: req.body.task_description ?? null,
            task_priority: req.body.task_priority ?? 0,
            task_status: req.body.task_status ?? 0,
            project_id: req.body.project_id ?? null,
            assignee_id: req.body.assignee_id ?? req.user.user_id,
            ...(req.body.assignee_id !== undefined ? { requester_id: req.user.user_id } : {})
        });
        if(!task) {
            throw new Error("Task creation failed!");
        }
        return res.status(201).json({
            message: "Task Created!",
            task
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};

export const getTask = async (req, res) => {
    try {
        req.body.user_id = req.user.user_id;
        req.body.task_id = req.params.id;
        if(req.query && req.query.status) {
            req.body.status = req.query.status;
        }
        if(req.query && req.query.priority) {
            req.body.priority = req.query.priority;
        }
        req.body.order = (req.query && req.query.order) || "ASC"; 
        req.body.offset = (req.query && req.query.offset) || 0;
        req.body.limit = (req.query && req.query.limit) || 10;
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
        const query = {
            ...req.query,
            user_id: req.user.user_id,
            order: req.query?.order || "ASC"
        };
        if (req.query?.offset !== undefined) query.offset = Number(req.query.offset);
        if (req.query?.limit !== undefined) query.limit = Number(req.query.limit);
        const task = await getAllTaskService(query);
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
        req.body.user_id = req.user.user_id;
        checkRequiredFields("updateTask", req.body);
        if (req.body.task_heading !== undefined && (typeof req.body.task_heading !== "string" || !req.body.task_heading.trim())) {
            return res.status(400).json({ message: "Task title cannot be empty." });
        }
        if (req.body.task_status !== undefined && (!Number.isInteger(req.body.task_status) || req.body.task_status < 0 || req.body.task_status > 4)) {
            return res.status(400).json({ message: "Invalid task status." });
        }
        if (req.body.project_id != null && (!Number.isInteger(req.body.project_id) || req.body.project_id < 1)) {
            return res.status(400).json({ message: "Invalid project." });
        }
        if (req.body.assignee_id !== undefined && (!Number.isInteger(req.body.assignee_id) || req.body.assignee_id < 1)) {
            return res.status(400).json({ message: "Invalid assignee." });
        }
        const [updatedRows] = await updateTaskService(req.body);
        if(!updatedRows) {
            throw new Error("Task update Failed!");
        }        
        return res.status(201).json({
            message: "Task updated successfully!"
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};
