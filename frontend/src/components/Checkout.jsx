import { useState } from "react";
import { placeOrder } from "../api/OrdersApi";
import Swal from "sweetalert2";

export default function CheckOut({
  setViewCheckout,
  orderItems,
  activeOrder,
  fetchOrders,
}) {
  const [payementMethod, setPaymentMethod] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm order!",
    });

    if (!result.isConfirmed) return;

    try {
      await placeOrder({
        payment_method: payementMethod,
        order_id: activeOrder.order_id,
      });

      Swal.fire({
        title: "completed",
        text: "Your order is placed!",
        icon: "success",
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
    setViewCheckout(false);
  }

  return (
    <section className="flex items-center justify-center absolute h-full w-full bg-gray-500/50 backdrop-blur-md rounded-xl top-0 left-0">
      <article className="flex flex-col h-10/12 min-w-120 gap-2 p-4 rounded-lg shadow bg-purple-400 ">
        <div className="flex items-center px-4 justify-between bg-purple-200 rounded h-10">
          <h1 className="text-xl text-shadow-2xs">Order-Details</h1>
          <button
            onClick={() => setViewCheckout(false)}
            className="bg-red-400 px-2 hover:bg-red-500 text-white shadow rounded"
          >
            Close
          </button>
        </div>
        <div className="p-2 flex-1 bg-purple-100 rounded">
          <table className="border-separate border-spacing-y-2 w-full rounded overflow-hidden">
            <thead>
              <tr className="bg-purple-400 text-white shadow shadow-gray-400">
                <th>Item_id</th>
                <th>Item_Name</th>
                <th>Price_at_time</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((order) => (
                <tr
                  key={order.order_item_id}
                  className="hover:scale-101 font-medium shadow h-4"
                >
                  <td>{order.order_item_id}</td>
                  <td>{order.item_name}</td>
                  <td>${order.price_at_time}</td>
                  <td>{order.order_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between h-10 px-6 font-medium bg-purple-200 rounded"
        >
          <h1>Total : ${activeOrder.order_amount}</h1>
          <select
            required
            className="bg-purple-500 font-light rounded py-0.5 px-2 outline-none shadow text-white"
            name="payement_method"
            id="payement_method"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Payment Method</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
            <option value="BANK">BANK</option>
          </select>
          <button className="bg-purple-500 px-6 shadow hover:bg-purple-400 cursor-pointer text-xl rounded text-white">
            Pay
          </button>
        </form>
      </article>
    </section>
  );
}
