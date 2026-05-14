export const checkOrderPaymentStatus = async ({ client, order_id }) => {
  const query = `
    SELECT payment_status
    FROM orders
    WHERE order_id = $1
  `;
  const result = await client.query(query, [order_id]);

  return result.rows;
};

export const updatePaymentMethodInDB = async ({
  client,
  order_id,
  payment_method,
}) => {
  const query = `
    UPDATE orders
    SET payment_method = $1
    WHERE order_id = $2
  `;

  await client.query(query, [payment_method, order_id]);
};
