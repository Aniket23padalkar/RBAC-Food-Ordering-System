import { FaPowerOff } from "react-icons/fa6";
import { logoutUser } from "../api/AuthApi";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Swal from "sweetalert2";

export default function Navbar() {
  const { setAuth } = useContext(AuthContext);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const result = await logoutUser();

      console.log(result);

      setSuccess(result.message);
      setAuth(null);
      Swal.fire({
        title: "Log Out",
        title: result.message,
        icon: "success",
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
      });
    }
  }
  return (
    <nav className="fixed top-4 self-center items-center shadow shadow-gray-400 w-1/2 rounded-2xl overflow-hidden">
      <div className="px-4 py-2 flex justify-between bg-purple-400">
        <div className="flex flex-1 gap-2 font-medium">
          <NavLink to="/" className="bg-purple-100 rounded-xl px-4 text-lg">
            Home
          </NavLink>
          <NavLink
            to="/orders"
            className="bg-purple-100 rounded-xl px-4 text-lg"
          >
            Orders
          </NavLink>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleLogout}
            className="text-xl bg-purple-200 font-bold text-red-400 px-2 rounded-lg hover:scale-110 hover:text-red-500"
          >
            <FaPowerOff />
          </button>
        </div>
      </div>
    </nav>
  );
}
