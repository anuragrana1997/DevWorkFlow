import express  from "express";
import { login, register } from "../controllers/authenticateController.js";
import { verifyJwt } from "../middleware/authenticateMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verifyJwt", verifyJwt)

export default router;