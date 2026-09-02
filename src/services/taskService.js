import Task from "../models/Task.js";

export const createTaskService = async (data) => {
    return await Task.create({ data });
};

export const getTaskService = async (data) => {
    const where = { assignee_id: data.user_id };
    if(data.task_id) {
        where.task_id = data.task_id;
    }
    if(data.status) {
        where.status = data.status;
    }
    if(data.priority) {
        where.priority = data.priority;
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
    if(data.status) {
        where.status = data.status;
    }
    if(data.priority) {
        where.priority = data.priority;
    }
    return await Task.findAll({
        where,
        order: [[ "task_id", data.order ]],
        offset: data.offset,
        limit: data.limit
    });
}

export const updateTaskService = async (data) => {
    return await Task.update(
        data,
        {
            where: {
                task_id: data.task_id, 
                assignee_id: data.user_id
            }
        }
    )
};
