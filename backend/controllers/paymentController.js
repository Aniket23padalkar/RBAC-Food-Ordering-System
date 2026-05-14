import { updatePaymentMethodService } from "../services/paymentServices.js";

export const updatePaymentMethod = async (req, res) => {
  try {
    const result = await updatePaymentMethodService({
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
