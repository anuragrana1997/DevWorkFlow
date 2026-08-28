import Comment from "../models/Comment.js";

export const createCommentService = async (data) => {
    return await Comment.create({ data });
}

export const updateCommentService = async (data) => {
    return await Comment.update(
        data,
        { 
            where: { 
                comment_id: data.comment_id, 
                user_id: data.user_id 
            }
        }
    );
}

export const getCommentService = async (data) => {
    const where = {};
    if(data.user_id) {
        where.user_id = data.user_id;
    }
    if(data.task_id) {
        where.task_id = data.task_id;
    }
    return await Comment.findAll({
        where
    });
};

export const deleteCommentService = async (data) => {
    // will fill if needed
};