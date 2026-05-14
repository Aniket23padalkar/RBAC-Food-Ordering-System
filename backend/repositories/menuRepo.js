import pool from "../config/db.js";

export const getMenuItemsFromDB = async ({ restaurant_id, limit, offset }) => {
  const query = `
        SELECT 
            menu_item_id,
            item_name,
            item_price,
            created_at
        FROM menu_items
        WHERE restaurant_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3    
        `;

  const result = await pool.query(query, [restaurant_id, limit, offset]);

  return result.rows;
};

export const getMenuItemsCount = async (restaurant_id) => {
  const query = `SELECT COUNT(*) FROM menu_items WHERE restaurant_id = $1`;

  const result = await pool.query(query, [restaurant_id]);

  return parseInt(result.rows[0].count);
};
