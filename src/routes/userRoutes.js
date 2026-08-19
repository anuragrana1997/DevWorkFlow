import express  from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { getUserDetails } from "../controllers/userController.js";
import { checkPrivilege } from "../middleware/userMiddleware.js";

const userRouter = express.Router();

userRouter.get("/getUserDetails", verifyJwt ,getUserDetails); 
userRouter.get("/getUserDetails/:id", verifyJwt, checkPrivilege, getUserDetails);

export default userRouter;