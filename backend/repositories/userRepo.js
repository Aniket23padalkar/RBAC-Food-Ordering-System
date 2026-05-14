import pool from "../config/db.js";

export const getUserProfileFromDB = (user_id) => {
  const query = `
        SELECT 
          user_id,
          username,
          email_id,
          role,
          country,
          created_at 
        FROM users WHERE user_id = $1
    `;

  return pool.query(query, [user_id]);
};
