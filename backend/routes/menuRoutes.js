import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getMenuItems } from "../controllers/menuController.js";

const router = express.Router();

router.get("/:restaurant_id", verifyToken, getMenuItems);

export default router;
