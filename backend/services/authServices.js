import bcrypt from "bcryptjs";
import { checkUserExistsInDB } from "../repositories/authRepo.js";
import jwt from "jsonwebtoken";

const generateToken = ({ user_id, username, email_id, role, country }) => {
  return jwt.sign(
    {
      user_id,
      username,
      email_id,
      role,
      country,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const loginUserService = async (body) => {
  const { email_id, password } = body;

  if (!email_id || !password) {
    const err = new Error("Please provide both email_id and password!");
    err.statusCode = 400;
    throw err;
  }

  const user = await checkUserExistsInDB(email_id);

  if (user.rows.length === 0) {
    const err = new Error("Please check the email_id");
    err.statusCode = 400;
    throw err;
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password_hash);

  if (!isMatch) {
    const err = new Error("Password is wrong! Please check");
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken({
    user_id: userData.user_id,
    username: userData.username,
    email_id: userData.email_id,
    role: userData.role,
    country: userData.country,
  });

  return {
    token,
    user: {
      user_id: userData.user_id,
      username: userData.username,
      email_id: userData.email_id,
      role: userData.role,
      country: userData.country,
    },
  };
};
