import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  cancelOrder,
  createOrder,
  getOrderItems,
  getOrders,
  placeOrder,
} from "../controllers/orderController.js";
import { allowRoles } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post("/:restaurant_id", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/order-items/:order_id", verifyToken, getOrderItems);
router.post(
  "/place/:order_id",
  verifyToken,
  allowRoles("admin", "manager"),
  placeOrder,
);
router.post(
  "/cancel/:order_id",
  verifyToken,
  allowRoles("admin", "manager"),
  cancelOrder,
);

export default router;
