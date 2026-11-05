import Task from "../models/Task.js";
import ProjectMembers from "../models/ProjectMembers.js";

const requireProjectAccess = async (projectId, userId) => {
    if (projectId == null) return;
    const membership = await ProjectMembers.findOne({ where: { project_id: projectId, user_id: userId } });
    const assignedTask = membership ? null : await Task.findOne({ where: { project_id: projectId, assignee_id: userId } });
    if (!membership && !assignedTask) {
        const error = new Error("You do not have access to this project.");
        error.statusCode = 403;
        throw error;
    }
};

export const createTaskService = async (data) => {
    await requireProjectAccess(data.project_id, data.assignee_id);
    return await Task.create(data);
};

export const getTaskService = async (data) => {
    const where = { assignee_id: data.user_id };
    if(data.task_id) {
        where.task_id = data.task_id;
    }
    if(data.status !== undefined) {
        where.task_status = data.status;
    }
    if(data.priority) {
        where.task_priority = data.priority;
    }
    return await Task.findAll({
        where,
        order: [[ "task_id", data.order ]],
        offset: data.offset,
        limit: data.limit
    });
};

export const getAllTaskService = async (data) => {
    const where = {assignee_id: data.user_id};
    if(data.status !== undefined) {
        where.task_status = data.status;
    }
    if(data.priority !== undefined) {
        where.task_priority = data.priority;
    }
    const options = {
        where,
        order: [[ "task_id", data.order ]]
    };
    if (data.offset !== undefined) options.offset = data.offset;
    if (data.limit !== undefined) options.limit = data.limit;
    return await Task.findAll(options);
}

export const updateTaskService = async (data) => {
    if (data.project_id !== undefined) await requireProjectAccess(data.project_id, data.user_id);
    const { task_heading, task_description, task_status, task_priority, project_id } = data;
    const changes = Object.fromEntries(Object.entries({ task_heading, task_description, task_status, task_priority, project_id })
        .filter(([, value]) => value !== undefined));
    return await Task.update(
        changes,
        {
            where: {
                task_id: data.task_id, 
                assignee_id: data.user_id
            }
        }
    )
};
