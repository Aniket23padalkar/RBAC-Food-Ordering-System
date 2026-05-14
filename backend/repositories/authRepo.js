import pool from "../config/db.js";

export const checkUserExistsInDB = async (email_id) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email_id = $1
    `,
    [email_id],
  );

  return result;
};
