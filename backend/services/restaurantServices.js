import {
  getRestaurantsCount,
  getRestaurantsFromDB,
} from "../repositories/restaurantRepo.js";

export const getRestaurantsService = async ({ user, query }) => {
  const { role, country } = user;
  const page = parseInt(query.currentPage) || 1;
  const limit = parseInt(query.limit) || 6;
  const offset = (page - 1) * limit;

  if (!role || !country) {
    const err = new Error("Role and Country required");
    err.statusCode = 400;
    throw err;
  }

  const total = await getRestaurantsCount({ role, country });

  const restaurants = await getRestaurantsFromDB({
    role,
    country,
    limit,
    offset,
  });

  return {
    restaurants,
    total,
    limit,
    startIndex: offset + 1,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};
