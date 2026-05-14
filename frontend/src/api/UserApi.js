const API = "http://localhost:5000/api/user";

export const getUserProfile = async () => {
  try {
    const res = await fetch(`${API}/me`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    return result.user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
