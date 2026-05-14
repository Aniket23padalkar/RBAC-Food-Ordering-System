import { getMenuItemsService } from "../services/menuServices.js";

export const getMenuItems = async (req, res) => {
  try {
    const result = await getMenuItemsService({
      query: req.query,
      restaurant_id: req.params.restaurant_id,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
