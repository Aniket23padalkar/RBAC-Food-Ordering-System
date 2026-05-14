import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const seedUsers = async () => {
  const users = [
    {
      username: "Nick Furry",
      email_id: "nickfury@example.com",
      role: "admin",
      country: "india",
    },
    {
      username: "Captain Marvel",
      email_id: "captainmarvel@example.com",
      role: "manager",
      country: "india",
    },
    {
      username: "Captain America",
      email_id: "captainamerica@example.com",
      role: "manager",
      country: "america",
    },
    {
      username: "Thanos",
      email_id: "thanos@example.com",
      role: "member",
      country: "india",
    },
    {
      username: "Thor",
      email_id: "thor@example.com",
      role: "member",
      country: "india",
    },
    {
      username: "Travis",
      email_id: "travis@example.com",
      role: "member",
      country: "america",
    },
  ];

  for (let user of users) {
    const hashedPassword = await bcrypt.hash("abc123", 10);

    await pool.query(
      `
        INSERT INTO users(username, email_id,password_hash,role,country)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (email_id) DO NOTHING
        `,
      [user.username, user.email_id, hashedPassword, user.role, user.country],
    );
  }

  console.log("Seed data inserted");
  process.exit();
};

seedUsers();
