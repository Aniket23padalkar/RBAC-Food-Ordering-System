import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getUserProfile);

export default router;
