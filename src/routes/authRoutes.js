import express  from "express";
import { login, register } from "../controllers/authenticateController.js";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";
import { getUserDetails } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verifyJwt", verifyJwt); //temp
router.get("/getUserDetails", verifyJwt ,getUserDetails); 

export default router;