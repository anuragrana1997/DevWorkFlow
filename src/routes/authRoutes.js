import express  from "express";
import { register } from "../controllers/authenticateController.js";

const router = express.Router();

console.log("here");
router.post("/register", register);

export default router;