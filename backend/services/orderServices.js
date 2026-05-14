import pool from "../config/db.js";
import {
  calculateTotal,
  cancelOrder,
  checkOrderExistsInDB,
  createOrderInDB,
  finalizeOrder,
  getActiveOrder,
  getMenuItem,
  getOrderItemsFromDB,
  getOrdersFromDB,
  insertOrderItem,
  itemExistsInMenu,
  updateOrderAmount,
} from "../repositories/orderRepo.js";

export const createOrderService = async ({ user_id, restaurant_id, body }) => {
  const { items } = body;

  if (!user_id || !restaurant_id) {
    const err = new Error("Please provide both user_id and restaurant_id");
    err.statusCode = 400;
    throw err;
  }

  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("Items not provided");
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let orderId = await getActiveOrder({ client, user_id, restaurant_id });

    if (!orderId) {
      orderId = await createOrderInDB({ client, user_id, restaurant_id });
    }

    for (let item of items) {
      if (item.quantity <= 0) {
        const err = new Error("Invalid quantity");
        err.statusCode = 400;
        throw err;
      }

      const itemPrice = await getMenuItem({
        client,
        menu_item_id: item.menu_item_id,
        restaurant_id,
      });

      await insertOrderItem({
        client,
        order_id: orderId,
        menu_item_id: item.menu_item_id,
        order_quantity: item.quantity,
        item_price: itemPrice,
      });
    }

    const total = await calculateTotal({ client, orderId });

    await updateOrderAmount({
      client,
      total,
      orderId,
      restaurant_id,
    });

    await client.query("COMMIT");

    return { message: "Order added to cart" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getOrderService = async (user) => {
  const { role, user_id, country } = user;

  if (!role || !user_id) {
    const err = new Error("Please provide both role and user_id");
    err.statusCode = 400;
    throw err;
  }

  const orders = await getOrdersFromDB({ role, user_id, country });

  if (orders.length === 0 || !orders) {
    const err = new Error("Orders not found!");
    err.statusCode = 404;
    throw err;
  }

  return orders;
};

export const getOrderItemsService = async (order_id) => {
  if (!order_id) {
    const err = new Error("Please prove order_id");
    err.statusCode = 400;
    throw err;
  }

  const orderItems = await getOrderItemsFromDB(order_id);

  if (orderItems.length === 0 || !orderItems) {
    const err = new Error("No order items found!");
    err.statusCode = 404;
    throw err;
  }

  return orderItems;
};

export const placeOrderService = async ({ user, order_id, body }) => {
  const { payment_method } = body;

  if (!order_id) {
    const err = new Error("Order_id is undefined");
    err.statusCode = 400;
    throw err;
  }

  if (!payment_method) {
    const err = new Error("Please provide payment_method");
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const order = await checkOrderExistsInDB({
      client,
      order_id,
    });

    if (order.length === 0) {
      const err = new Error("No order found");
      err.statusCode = 400;
      throw err;
    }

    if (user.role === "member") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    if (user.role === "manager" && user.country !== order[0].country) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const orderId = order[0].order_id;

    const items = await itemExistsInMenu({ client, orderId });

    if (items.length === 0) {
      const err = new Error("Cart is empty");
      err.statusCode = 400;
      throw err;
    }

    await finalizeOrder({
      client,
      payment_method,
      orderId,
    });

    await client.query("COMMIT");
    return { message: "Order placed successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const cancelOrderService = async ({ user, order_id }) => {
  if (!order_id) {
    const err = new Error("Order_id is undefined");
    err.statusCode = 400;
    throw err;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const order = await checkOrderExistsInDB({ client, order_id });

    if (user.role === "member") {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    if (user.role === "manager" && user.country !== order[0].country) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    if (order.length === 0) {
      const err = new Error("Order not found");
      err.statusCode = 400;
      throw err;
    }

    await cancelOrder({ client, order_id });

    await client.query("COMMIT");

    return { message: "Order cancelled successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
