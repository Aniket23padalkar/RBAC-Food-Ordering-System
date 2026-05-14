import {
  cancelOrderService,
  createOrderService,
  getOrderItemsService,
  getOrderService,
  placeOrderService,
} from "../services/orderServices.js";

export const createOrder = async (req, res) => {
  try {
    const result = await createOrderService({
      user_id: req.user.user_id,
      restaurant_id: req.params.restaurant_id,
      body: req.body,
    });

    res.status(201).json({ message: result.message });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const result = await getOrderService(req.user);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const result = await getOrderItemsService(req.params.order_id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const result = await placeOrderService({
      user: req.user,
      order_id: req.params.order_id,
      body: req.body,
    });

    res.status(200).json({ message: result.message });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const result = await cancelOrderService({
      user: req.user,
      order_id: req.params.order_id,
    });

    res.status(200).json({ message: result.message });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
