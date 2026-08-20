import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { checkPrivilege } from "../middleware/userMiddleware.js";
import { addMemberToProject } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/addUsertoProject", verifyJwt, checkPrivilege, addMemberToProject);

export default projectRouter;