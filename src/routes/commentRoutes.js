import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { createComment, getComment, updateComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.get("/getComments/:user_id/:task_id", verifyJwt, getComment);
commentRouter.patch("/updateComment", verifyJwt, updateComment);
commentRouter.put("/createComment", verifyJwt, createComment)

export default commentRouter;