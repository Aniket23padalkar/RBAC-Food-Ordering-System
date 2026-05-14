import { getUserProfileFromDB } from "../repositories/userRepo.js";

export const getUserProfileServices = async (user_id) => {
  const user = await getUserProfileFromDB(user_id);

  if (user.rows.length === 0) {
    const err = new Error("Wrong user_id");
    err.statusCode = 400;
    throw err;
  }

  return user.rows[0];
};
