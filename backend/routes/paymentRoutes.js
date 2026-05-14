import express from "express";
import { updatePaymentMethod } from "../controllers/paymentController.js";
import { allowRoles } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post(
  "/update_payment_method/:order_id",
  verifyToken,
  allowRoles("admin"),
  updatePaymentMethod,
);

export default router;
