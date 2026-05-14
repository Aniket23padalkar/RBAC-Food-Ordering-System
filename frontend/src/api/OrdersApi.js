const API = "http://localhost:5000/api/orders";

export const createOrder = async ({ restaurant_id, items }) => {
  try {
    const res = await fetch(`${API}/${restaurant_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
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

export const getOrders = async () => {
  try {
    const res = await fetch(`${API}`, {
      method: "GET",
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

export const getOrderItems = async (order_id) => {
  try {
    const res = await fetch(`${API}/order-items/${order_id}`, {
      method: "GET",
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

export const placeOrder = async ({ order_id, payment_method }) => {
  try {
    const res = await fetch(`${API}/place/${order_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_method: payment_method }),
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

export const cancelOrder = async (order_id) => {
  try {
    const res = await fetch(`${API}/cancel/${order_id}`, {
      method: "POST",
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
