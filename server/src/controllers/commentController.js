import { checkRequiredFields } from "../common/requiredFields.js";
import { createCommentService, getCommentService, updateCommentService } from "../services/commentService.js"; 

export const createComment = async (req, res) => {
    try {
        checkRequiredFields("createComment", req.body);
        const comment = await createCommentService(req.body);
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
        const comments = await getCommentService(req.query);
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
        return res.status(201).json({
            message: "Delete Success"
        });
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            message: error.message
        });
    }
};