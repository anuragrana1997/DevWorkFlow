import express  from "express";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { deleteUser, getUserDetails, updateUserDetails } from "../controllers/userController.js";
import { checkPrivilege } from "../middleware/userMiddleware.js";

const userRouter = express.Router();

userRouter.get("/getUserDetails", verifyJwt ,getUserDetails); 
userRouter.get("/getUserDetails/:id", verifyJwt, checkPrivilege, getUserDetails);
userRouter.patch("/updateUserDetails", verifyJwt, checkPrivilege, updateUserDetails);
userRouter.delete("/deleteUser", verifyJwt, checkPrivilege, deleteUser);

export default userRouter;