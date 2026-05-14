import {
  getMenuItemsCount,
  getMenuItemsFromDB,
} from "../repositories/menuRepo.js";

export const getMenuItemsService = async ({ query, restaurant_id }) => {
  const page = parseInt(query.currentPage) || 1;
  const limit = parseInt(query.limit) || 5;
  const offset = (page - 1) * limit;

  if (!restaurant_id) {
    const err = new Error("Please provide restaurant_id");
    err.statusCode = 400;
    throw err;
  }

  const menuItems = await getMenuItemsFromDB({ restaurant_id, limit, offset });

  const total = await getMenuItemsCount(restaurant_id);

  return {
    menuItems,
    total,
    totalPages: Math.ceil(total / limit),
    limit,
    currentPage: page,
    startIndex: offset + 1,
  };
};
