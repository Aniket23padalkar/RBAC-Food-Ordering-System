import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuItems } from "../api/RestaurantApi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";
import { createOrder } from "../api/OrdersApi";
import Swal from "sweetalert2";

export default function MenuItems() {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const result = await getMenuItems(id);

        setMenu(result.menuItems);
        setPagination({
          currentPage: result.currentPage,
          limit: result.limit,
          startIndex: result.startIndex,
          total: result.total,
          totalPages: result.totalPages,
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, [id]);

  function handleIncreaseQty(id) {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.menu_item_id === id);

      if (existingItem) {
        return prev.map((item) =>
          item.menu_item_id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { menu_item_id: id, quantity: 1 }];
    });
  }

  function handleDecreaseQty(id) {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.menu_item_id === id);

      if (!existingItem) return prev;

      if (existingItem.quantity === 1) {
        return prev.filter((item) => item.menu_item_id !== id);
      }

      return prev.map((item) =>
        item.menu_item_id === id
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item,
      );
    });
  }

  async function handleCreateOrder() {
    try {
      const result = await createOrder({ restaurant_id: id, items });

      console.log(result.message);
      Swal.fire({
        title: "Success",
        text: result.message,
        icon: "success",
      });
      navigate("/orders");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-147 w-full p-4">
      <section className="flex flex-col  w-120 bg-purple-400 p-4 rounded-2xl">
        <span className="flex items-center text-white font-bold text-2xl mb-4">
          <h1>
            <MdOutlineRestaurantMenu />
          </h1>
          Menu
        </span>
        <article className="flex-1 bg-purple-100 rounded p-4">
          <ul className="">
            {menu?.map((item, index) => (
              <li
                key={item.menu_item_id}
                className="flex items-center text-lg hover:scale-101 bg-purple-400 text-white mt-2 p-2 rounded shadow"
              >
                <span className="mr-2">{pagination.startIndex + index}</span>
                <h1 className="mr-auto">{item.item_name}</h1>
                <p className="mr-2">${item.item_price}</p>
                <button
                  onClick={() => handleDecreaseQty(item.menu_item_id)}
                  className="bg-purple-200 px-2 h-6 text-black text-2xl rounded hover:bg-purple-500"
                >
                  <FaMinus size={15} />
                </button>
                <span className=" flex justify-center w-6">
                  {items.find((i) => i.menu_item_id === item.menu_item_id)
                    ?.quantity || 0}
                </span>
                <button
                  onClick={() => handleIncreaseQty(item.menu_item_id)}
                  className="bg-purple-200 text-black h-6 px-2 rounded text-xl hover:bg-purple-500"
                >
                  <FaPlus size={15} />
                </button>
              </li>
            ))}
          </ul>
        </article>
        {items.length > 0 && (
          <button
            onClick={handleCreateOrder}
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white rounded mt-4 ml-auto py-1 w-1/2"
          >
            Add to cart
          </button>
        )}
      </section>
    </main>
  );
}
