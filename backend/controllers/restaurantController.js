import { getRestaurantsService } from "../services/restaurantServices.js";

export const getRestaurants = async (req, res) => {
  try {
    const result = await getRestaurantsService({
      user: req.user,
      query: req.query,
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
