const API = "http://localhost:5000/api";

export const getRestaurants = async () => {
  try {
    const res = await fetch(`${API}/restaurants`, {
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

export const getMenuItems = async (id) => {
  try {
    const res = await fetch(`${API}/menu/${id}`, {
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
