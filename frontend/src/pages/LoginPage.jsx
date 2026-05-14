import { LuLogIn } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { loginUser } from "../api/AuthApi";
import { BarLoader } from "react-spinners";

export default function LoginPage() {
  const { setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email_id: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginUser(loginForm);

      setAuth(result);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col justify-center items-center w-full h-screen bg-image ">
      <section className="flex flex-col w-110 h-110 p-6 shadow text-white border-8 bg-purple-400/40 backdrop-blur-3xl border-purple-400 rounded">
        <div className="flex items-center gap-2">
          <LuLogIn fontSize="25px" />
          <h1 className="text-2xl">Login</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full h-full items-center justify-center"
        >
          <h1 className="text-2xl">Welcome!</h1>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex relative mt-6">
            <span className="absolute top-4 text-2xl">
              <MdOutlineEmail />
            </span>
            <input
              className="input"
              type="text"
              name="email_id"
              value={loginForm.email_id}
              onChange={handleChange}
              placeholder="Email-Id"
            />
          </div>
          <div className="flex relative">
            <span className="absolute top-4 text-2xl">
              <RiLockPasswordLine />
            </span>
            <input
              className="input"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <button className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 cursor-pointer mt-8 w-30 h-10 rounded">
            {loading ? <BarLoader size={10} color="#ffefb8" /> : "Sign-In"}
          </button>
        </form>
      </section>
    </main>
  );
}
