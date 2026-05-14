import { getUserProfileServices } from "../services/userServices.js";

export const getUserProfile = async (req, res) => {
  try {
    const result = await getUserProfileServices(req.user.user_id);

    res.status(200).json({ user: result });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error!" });
  }
};
