import ActivityLog from "../models/ActivityLog.js";

export const createActivityLogService = async (data) => {
    return await ActivityLog.create({ data });
}

export const updateActivityLogService = async (data) => {
    return await ActivityLog.update(
        data,
        {
            where: {
                log_id: data.log_id,
                user_id: data.user_id
            }
        }
    );
}

export const getActivityLogService = async (data) => {
    return await ActivityLog.findAll({ 
        where: { task_id: data.task_id }
    });
}

export const deleteActivityLogService = async (data) => {
    return await ActivityLog.destroy({
        where: { log_id: data.log_id }
    })
}