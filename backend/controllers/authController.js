import { loginUserService } from "../services/authServices.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const loginUser = async (req, res) => {
  try {
    const { token, user } = await loginUserService(req.body);

    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", cookieOptions, { maxAge: 1 });
  res.status(200).json({ message: "Loggedout Successfully" });
};
