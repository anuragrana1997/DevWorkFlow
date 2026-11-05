import { checkRequiredFields } from "../common/requiredFields.js";
import { createCommentService, deleteCommentService, getCommentService, updateCommentService } from "../services/commentService.js";

export const createComment = async (req, res) => {
    try {
        checkRequiredFields("createComment", req.body);
        if (!req.body.comment_description.trim()) return res.status(400).json({ message: "Comment cannot be empty." });
        const comment = await createCommentService({
            task_id: req.body.task_id,
            comment_description: req.body.comment_description.trim(),
            user_id: req.user.user_id
        });
        return res.status(201).json({
            message: "Comment Successful!",
            comment
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        checkRequiredFields("updateComment", req.body);
        if (!req.body.comment_description.trim()) return res.status(400).json({ message: "Comment cannot be empty." });
        const [updatedRows] = await updateCommentService(req.body);
        if(updatedRows) {
            return res.status(201).json({
                message: "update success"
            });
        } else {
            return res.status(401).json({
                message: "update failed"
            });
        }
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};

export const getComment = async (req, res) => {
    try {
        const comments = await getCommentService({ task_id: req.params.task_id });
        return res.status(201).json({
            message: "Fetch Success",
            comments
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
};

export const deleteComment = async (req, res) => {
    try {
        checkRequiredFields("deleteComment", req.body)
        const deletedRows = await deleteCommentService({
            comment_id: req.body.comment_id,
            user_id: req.user.user_id
        });
        if (!deletedRows) return res.status(404).json({ message: "Comment not found or not yours." });
        return res.status(201).json({
            message: "Delete Success"
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};
