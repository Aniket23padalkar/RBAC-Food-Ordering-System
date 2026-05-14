import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
  console.log("Connected to database");
});

pool.on("error", (err) => {
  console.error("Database Error", err);
});

export default pool;
