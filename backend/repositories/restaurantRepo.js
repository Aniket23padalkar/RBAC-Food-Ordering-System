import pool from "../config/db.js";

export const getRestaurantsFromDB = async ({
  role,
  country,
  limit,
  offset,
}) => {
  let query;
  let values = [];
  if (role === "admin") {
    query = `
        SELECT * 
        FROM restaurants 
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `;
    values = [limit, offset];
  } else {
    query = `
        SELECT * 
        FROM restaurants 
        WHERE country = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
    `;
    values = [country, limit, offset];
  }

  const result = await pool.query(query, values);

  return result.rows;
};

export const getRestaurantsCount = async ({ role, country }) => {
  let query;
  let values = [];

  if (role === "admin") {
    query = `SELECT COUNT(*) FROM restaurants`;
  } else {
    query = `SELECT COUNT(*) FROM restaurants WHERE country = $1`;
    values = [country];
  }

  const result = await pool.query(query, values);

  return parseInt(result.rows[0].count);
};
