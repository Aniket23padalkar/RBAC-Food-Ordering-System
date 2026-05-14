import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import ProtectLayout from "./layouts/ProtectLayout";
import ProtectAuth from "./layouts/ProtectAuth";
import MenuItems from "./pages/MenuItems";

export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      {auth && <Navbar />}
      {auth && <section className="h-20"></section>}
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectAuth>
              <LoginPage />
            </ProtectAuth>
          }
        />
        <Route
          path="/"
          element={
            <ProtectLayout>
              <HomePage />
            </ProtectLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectLayout>
              <OrdersPage />
            </ProtectLayout>
          }
        />
        <Route
          path="/menu-items/:id"
          element={
            <ProtectLayout>
              <MenuItems />
            </ProtectLayout>
          }
        />
      </Routes>
    </>
  );
}
