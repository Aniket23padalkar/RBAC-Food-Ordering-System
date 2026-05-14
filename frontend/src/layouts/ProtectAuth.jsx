import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { BarLoader } from "react-spinners";
import { Navigate } from "react-router-dom";

export default function ProtectAuth({ children }) {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BarLoader />
      </div>
    );
  }

  if (auth) {
    return <Navigate to="/" />;
  }

  return children;
}
