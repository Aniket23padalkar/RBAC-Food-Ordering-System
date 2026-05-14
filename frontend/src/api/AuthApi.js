const API = "http://localhost:5000/api/auth";

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: data.email_id?.trim(),
        password: data.password?.trim(),
      }),
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Login failed");
    }

    return result.user;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const res = await fetch(`${API}/logout`, {
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
