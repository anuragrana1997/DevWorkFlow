import { User, Task, ProjectMembers, ActivityLog } from "../models/index.js";

const httpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const requireTaskAccess = async (taskId, userId) => {
    const task = await Task.findByPk(taskId);
    if (!task) throw httpError(404, "Task not found.");

    const user = await User.findByPk(userId);
    if (!user || user.is_active === 0) throw httpError(403, "Access denied.");

    if (user.privilege === 1 || task.assignee_id === userId) return task;

    const membership = task.project_id && await ProjectMembers.findOne({
        where: { project_id: task.project_id, user_id: userId }
    });
    if (!membership) throw httpError(403, "Access denied.");

    return task;
};

export const listTaskActivity = async (taskId) => {
    const logs = await ActivityLog.findAll({
        where: { task_id: taskId },
        attributes: ["log_id", "user_id", "log_description", "hours_logged", "created_at"],
        order: [["created_at", "DESC"], ["log_id", "DESC"]]
    });

    const authorIds = [...new Set(logs.map((log) => log.user_id).filter(Boolean))];
    const authors = authorIds.length === 0 ? [] : await User.findAll({
        where: { user_id: authorIds },
        attributes: ["user_id", "first_name", "last_name"]
    });
    const names = new Map(authors.map((author) => [
        author.user_id,
        `${author.first_name} ${author.last_name}`.trim()
    ]));

    return logs.map((log) => ({
        ...log.toJSON(),
        author_name: names.get(log.user_id) || "Unknown member"
    }));
};

export const createTaskActivity = async ({ taskId, userId, description, hours }) => {
    const log = await ActivityLog.create({
        task_id: taskId,
        user_id: userId,
        log_description: description,
        hours_logged: hours
    });
    const author = await User.findByPk(userId, {
        attributes: ["first_name", "last_name"]
    });

    return {
        ...log.toJSON(),
        author_name: author ? `${author.first_name} ${author.last_name}`.trim() : "Unknown member"
    };
};

