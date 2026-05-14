import express from "express";
import { getRestaurants } from "../controllers/restaurantController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getRestaurants);

export default router;
