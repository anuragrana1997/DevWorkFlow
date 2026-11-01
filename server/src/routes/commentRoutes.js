import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { createComment, deleteComment, getComment, updateComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.get("/getComments/:task_id", verifyJwt, getComment);
commentRouter.patch("/updateComment", verifyJwt, updateComment);
commentRouter.post("/createComment", verifyJwt, createComment);
commentRouter.delete("/deleteComment", verifyJwt, deleteComment);

export default commentRouter;
