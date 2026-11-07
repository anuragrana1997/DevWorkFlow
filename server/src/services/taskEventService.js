import ActivityLog from "../models/ActivityLog.js";

const statusNames = ["Open", "In progress", "Testing", "Complete", "Closed"];
const priorityNames = ["Low", "Medium", "High"];

export const describeTaskChanges = (changes) => {
    const descriptions = [];

    if (changes.task_heading !== undefined) descriptions.push("updated the title");
    if (changes.task_description !== undefined) descriptions.push("updated the description");
    if (changes.task_status !== undefined) descriptions.push(`set status to ${statusNames[changes.task_status]}`);
    if (changes.task_priority !== undefined) descriptions.push(`set priority to ${priorityNames[changes.task_priority]}`);
    if (changes.project_id !== undefined) {
        descriptions.push(changes.project_id === null ? "removed the project" : `moved to project #${changes.project_id}`);
    }
    if (changes.assignee_id !== undefined) {
        descriptions.push(changes.assignee_id === null ? "unassigned the task" : `assigned to member #${changes.assignee_id}`);
    }

    return descriptions.length ? `Task updated: ${descriptions.join(", ")}.` : "Task updated.";
};

export const recordTaskEvent = (taskId, userId, description, transaction) => {
    return ActivityLog.create({
        task_id: taskId,
        user_id: userId,
        log_description: description,
        hours_logged: 0
    }, { transaction });
};
