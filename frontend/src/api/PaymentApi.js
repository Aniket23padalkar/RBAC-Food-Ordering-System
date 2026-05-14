const API = "http://localhost:5000/api/payment/update_payment_method";

export const updatePaymentMethod = async ({ order_id, editPaymentMethod }) => {
  try {
    const res = await fetch(`${API}/${order_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_method: editPaymentMethod }),
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result;
  } catch (err) {
    throw err;
  }
};
