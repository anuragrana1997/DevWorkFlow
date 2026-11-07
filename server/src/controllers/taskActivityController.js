import {
    requireTaskAccess,
    listTaskActivity,
    createTaskActivity
} from "../services/taskActivityService.js";

const parseTaskId = (value) => {
    const taskId = Number(value);
    return Number.isSafeInteger(taskId) && taskId > 0 ? taskId : null;
};

const sendError = (error, res) => {
    const status = error.statusCode || 500;
    res.status(status).json({
        message: status === 500 ? "Unable to process task activity." : error.message
    });
};

export const getTaskHistory = async (req, res) => {
    const taskId = parseTaskId(req.params.taskId);
    if (!taskId) return res.status(400).json({ message: "Invalid task." });

    try {
        await requireTaskAccess(taskId, req.user.user_id);
        const logs = await listTaskActivity(taskId);
        return res.json({ logs });
    } catch (error) {
        return sendError(error, res);
    }
};

export const postTaskActivity = async (req, res) => {
    const taskId = parseTaskId(req.params.taskId);
    const description = req.body.log_description;
    const hours = req.body.hours_logged ?? 0;

    if (!taskId) return res.status(400).json({ message: "Invalid task." });
    if (typeof description !== "string" || !description.trim() || description.trim().length > 2000) {
        return res.status(400).json({ message: "Activity description must be 1 to 2000 characters." });
    }
    if (!Number.isInteger(hours) || hours < 0 || hours > 9999) {
        return res.status(400).json({ message: "Hours must be a whole number from 0 to 9999." });
    }

    try {
        await requireTaskAccess(taskId, req.user.user_id);
        const log = await createTaskActivity({
            taskId,
            userId: req.user.user_id,
            description: description.trim(),
            hours
        });
        return res.status(201).json({ log });
    } catch (error) {
        return sendError(error, res);
    }
};
