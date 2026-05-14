import pool from "../config/db.js";

export const getActiveOrder = async ({ client, user_id, restaurant_id }) => {
  const query = `
    SELECT order_id
    FROM orders
    WHERE user_id = $1
      AND restaurant_id = $2
      AND order_status = 'pending'
    LIMIT 1
  `;

  const result = await client.query(query, [user_id, restaurant_id]);

  return result.rows[0]?.order_id || null;
};

export const createOrderInDB = async ({ client, user_id, restaurant_id }) => {
  const query = `
        INSERT INTO orders
            (user_id,restaurant_id)
        VALUES
            ($1,$2)
        RETURNING order_id
    `;

  const result = await client.query(query, [user_id, restaurant_id]);

  return result.rows[0]?.order_id || null;
};

export const getOrdersFromDB = async ({ role, user_id }) => {
  let query;
  let values = [];

  if (role === "admin" || role === "manager") {
    query = `
      SELECT
        order_id,
        payment_status,
        payment_method,
        order_status,
        order_amount,
        created_at
      FROM orders 
      ORDER BY created_at DESC
    `;
  } else {
    query = `
      SELECT
        order_id,
        payment_status,
        payment_method,
        order_status,
        order_amount,
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    values = [user_id];
  }

  const result = await pool.query(query, values);

  return result.rows;
};

export const getOrderItemsFromDB = async (order_id) => {
  const query = `
    SELECT
      oi.order_item_id,
      mi.item_name,
      oi.price_at_time,
      oi.order_quantity,
      oi.created_at
    FROM order_items oi
    JOIN menu_items mi ON mi.menu_item_id = oi.menu_item_id
    WHERE oi.order_id = $1
  `;

  const result = await pool.query(query, [order_id]);

  return result.rows;
};

export const getMenuItem = async ({ client, menu_item_id, restaurant_id }) => {
  const query = `
        SELECT 
            item_price
        FROM menu_items
        WHERE menu_item_id = $1 AND restaurant_id = $2
    `;

  const result = await client.query(query, [menu_item_id, restaurant_id]);

  return result.rows[0].item_price;
};

export const insertOrderItem = async ({
  client,
  order_id,
  menu_item_id,
  order_quantity,
  item_price,
}) => {
  const query = `
        INSERT INTO order_items
            (order_id, menu_item_id, order_quantity, price_at_time)
        VALUES
            ($1,$2,$3,$4)
        ON CONFLICT (order_id,menu_item_id)
        DO UPDATE
        SET order_quantity = EXCLUDED.order_quantity
    `;

  const result = await client.query(query, [
    order_id,
    menu_item_id,
    order_quantity,
    item_price,
  ]);

  return result;
};

export const updateOrderAmount = async ({
  client,
  total,
  orderId,
  restaurant_id,
}) => {
  const query = `
        UPDATE orders
        SET order_amount = $1
        WHERE order_id = $2 AND restaurant_id = $3
    `;

  const result = await client.query(query, [total, orderId, restaurant_id]);

  return result;
};

export const calculateTotal = async ({ client, orderId }) => {
  const query = `
    SELECT SUM(order_quantity * price_at_time)
    FROM order_items
    WHERE order_id = $1
  `;

  const result = await client.query(query, [orderId]);

  return result.rows[0]?.sum || 0;
};

export const itemExistsInMenu = async ({ client, orderId }) => {
  const query = `
    SELECT 1 FROM order_items WHERE order_id = $1
  `;

  const result = await client.query(query, [orderId]);

  return result.rows;
};

export const finalizeOrder = async ({ client, orderId, payment_method }) => {
  const query = `
    UPDATE orders
    SET order_status = 'completed',
        payment_status = 'paid',
        payment_method = $1
    WHERE order_id = $2
      AND order_status = 'pending'
  `;

  await client.query(query, [payment_method, orderId]);
};

export const checkOrderExistsInDB = async ({ client, order_id }) => {
  const query = `
    SELECT 
      o.order_id,
      order_status,
      r.country
    FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.restaurant_id
    WHERE o.order_id = $1 
      AND o.order_status = 'pending'`;

  const result = await client.query(query, [order_id]);

  return result.rows;
};

export const cancelOrder = async ({ client, order_id }) => {
  const query = `
    UPDATE orders
    SET order_status = 'cancelled'
    WHERE order_id = $1 AND order_status = 'pending'
  `;

  await client.query(query, [order_id]);
};
