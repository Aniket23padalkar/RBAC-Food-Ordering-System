import { useContext, useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { cancelOrder, getOrderItems, getOrders } from "../api/OrdersApi";
import { AuthContext } from "../context/authContext";
import CheckOut from "../components/Checkout";
import Swal from "sweetalert2";
import { updatePaymentMethod } from "../api/PaymentApi";

export default function OrdersPage() {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [activeOrder, setactiveOrder] = useState(null);
  const [orderItems, setOrderItems] = useState(null);
  const [viewCheckout, setViewCheckout] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState(null);

  async function fetchOrders() {
    try {
      const result = await getOrders();

      setOrders(result);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleGetOrderItems({ order_id, order_amount }) {
    setViewCheckout(true);
    setactiveOrder({ order_id, order_amount });
    try {
      const result = await getOrderItems(order_id);

      setOrderItems(result);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCancelOrder(order_id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelOrder(order_id);

      Swal.fire({
        title: "Canceled!",
        text: "Your order has cancelled.",
        icon: "success",
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
      });
    }
  }

  async function handleUpdatePaymentMethod(order_id) {
    if (!editingOrderId && !editPaymentMethod) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });

    if (!result.isConfirmed) return;
    try {
      await updatePaymentMethod({
        order_id,
        editPaymentMethod,
      });
      setEditingOrderId(null);
      setEditPaymentMethod(null);

      Swal.fire({
        title: "Updated!",
        text: "Payment Method Updated",
        icon: "success",
      });

      fetchOrders();
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
    <main className="flex items-center justify-center h-147 w-full">
      <section className="flex flex-col relative h-120 gap-4 p-4 rounded-lg shadow bg-purple-400">
        <div className="flex flex-col px-4 py-2 bg-purple-100 w-full  rounded shadow-lg">
          <span className="flex items-center gap-2">
            <IoCartOutline size={25} />{" "}
            <h1 className="text-2xl font-medium">Orders</h1>
          </span>
        </div>
        <article className="flex flex-1 flex-col overflow-y-auto bg-purple-100 rounded shadow-lg p-4">
          <table className="border-separate border-spacing-y-2 rounded overflow-hidden">
            <thead>
              <tr className="bg-purple-400 text-white shadow shadow-gray-400">
                <th>Order_id</th>
                <th>Payment_Method</th>
                <th>Payment_status</th>
                <th>Order_status</th>
                <th>Order_amount</th>
                <th>CheckOut</th>
                <th>Cancel_order</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order.order_id}
                  className="hover:scale-101 font-medium shadow"
                >
                  <td>{order.order_id}</td>
                  <td className="text-purple-800">
                    {editingOrderId === order.order_id ? (
                      <select
                        required
                        className="bg-purple-500 font-light rounded py-0.5 px-2 outline-none shadow text-white"
                        name="payement_method"
                        id="payement_method"
                        onChange={(e) => setEditPaymentMethod(e.target.value)}
                      >
                        <option value="">Payment Method</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">CARD</option>
                        <option value="BANK">BANK</option>
                      </select>
                    ) : (
                      <p>
                        {order.payment_method
                          ? order.payment_method
                          : "Not Set"}
                      </p>
                    )}
                  </td>
                  <td
                    className={`${order.payment_status === "pending" ? "text-yellow-600" : order.payment_status === "failed" ? "text-red-600" : "text-green-700"}`}
                  >
                    {order.payment_status}
                  </td>
                  <td className="flex items-center justify-center">
                    <p
                      className={`border-2 w-20 text-xs p-1 rounded ${order.order_status === "completed" ? "border-green-500 bg-green-200 text-green-800" : order.order_status === "cancelled" ? "border-red-400 text-red-700 bg-red-200" : "border-yellow-400 text-yellow-800 bg-yellow-100"}`}
                    >
                      {order.order_status}
                    </p>
                  </td>
                  <td>${order.order_amount}</td>
                  <td>
                    {order.payment_status === "failed" ? (
                      <button
                        disabled={
                          auth.role === "manager" ||
                          auth.role === "member" ||
                          order.order_status === "cancelled"
                        }
                        onClick={() => {
                          if (editingOrderId === order.order_id) {
                            handleUpdatePaymentMethod(order.order_id);
                          } else {
                            setEditingOrderId(order.order_id);
                          }
                        }}
                        className="bg-yellow-300 text-wrap w-18 min-h-6 text-xs disabled:cursor-default disabled:bg-gray-300 disabled:text-gray-500 rounded text-yellow-800 shadow hover:bg-yellow-200 cursor-pointer px-1"
                      >
                        {editingOrderId === order.order_id
                          ? "Confirm"
                          : "Update Pay Method"}
                      </button>
                    ) : (
                      <button
                        disabled={
                          auth.role === "member" ||
                          order.order_status === "completed" ||
                          order.order_status === "cancelled" ||
                          order.payment_status === "paid"
                        }
                        onClick={() =>
                          handleGetOrderItems({
                            order_id: order.order_id,
                            order_amount: order.order_amount,
                          })
                        }
                        className="bg-purple-500 p-1 cursor-pointer hover:bg-purple-400 disabled:cursor-default rounded text-white text-sm disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        Checkout
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      disabled={
                        auth.role === "member" ||
                        order.order_status === "completed" ||
                        order.order_status === "cancelled"
                      }
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="bg-red-400 p-1 text-white rounded disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {viewCheckout && (
            <CheckOut
              setViewCheckout={setViewCheckout}
              orderItems={orderItems}
              activeOrder={activeOrder}
              fetchOrders={fetchOrders}
            />
          )}
        </article>
      </section>
    </main>
  );
}
