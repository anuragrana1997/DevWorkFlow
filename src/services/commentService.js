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
    return await Comment.findAll({
        where: {task_id: data.task_id}
    });
};

export const deleteCommentService = async (data) => {
    // will fill if needed
};