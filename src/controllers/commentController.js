import { createCommentService, getCommentService, updateCommentService } from "../services/commentService"; 

export const createComment = async (req, res) => {
    try {
        const comment = await createComment(req.body);
        return res.status(201).json({
            message: "Comment Successful!",
            comment
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        if(req.body) {
            if(!req.body.user_id) {
                throw new Error("user_id is required!");
            }
            if(!req.body.comment_id) {
                throw new Error("comment_id is required");
            }
        }
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
        return res.status(401).json({
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

// export const deleteComment = async (req, res) => {};