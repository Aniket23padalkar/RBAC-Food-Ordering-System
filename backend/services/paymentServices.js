import pool from "../config/db.js";
import {
  checkOrderPaymentStatus,
  updatePaymentMethodInDB,
} from "../repositories/paymentRepo.js";

export const updatePaymentMethodService = async ({ user, order_id, body }) => {
  const { payment_method } = body;

  if (!payment_method) {
    const err = new Error("Please provide payment_method");
    err.statusCode = 400;
    throw err;
  }
  if (!order_id) {
    const err = new Error("Please provide order_id");
    err.statusCode = 400;
    throw err;
  }

  if (user.role !== "admin") {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const getPaymentStatus = await checkOrderPaymentStatus({
      client,
      order_id,
    });

    if (getPaymentStatus.length === 0) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }

    const paymentStatus = getPaymentStatus[0].payment_status;

    if (paymentStatus !== "failed") {
      const err = new Error(
        "Payment method can only be updated for failed payments",
      );
      err.statusCode = 400;
      throw err;
    }

    await updatePaymentMethodInDB({ client, order_id, payment_method });

    await client.query("COMMIT");

    return { message: "Payment method updated" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
