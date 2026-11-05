import express from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { checkPrivilege } from "../middleware/userMiddleware.js";
import { addMemberToProject, changeProjectStatus, createProject, getProjects, updateProject } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/getAllProjects", verifyJwt, getProjects)
projectRouter.post("/addUsertoProject", verifyJwt, checkPrivilege, addMemberToProject);
projectRouter.post("/createProject", verifyJwt, checkPrivilege, createProject);
projectRouter.post("/changeProjectStatus", verifyJwt, checkPrivilege, changeProjectStatus)
projectRouter.patch("/updateProject", verifyJwt, checkPrivilege, updateProject);

export default projectRouter;
