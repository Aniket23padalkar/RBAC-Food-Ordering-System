import { useEffect } from "react";
import { useState } from "react";
import { getRestaurants } from "../api/RestaurantApi";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const result = await getRestaurants();

        setRestaurants(result.restaurants);
        setPagination({
          currentPage: result.currentPage,
          limit: result.limit,
          startIndex: result.startIndex,
          total: result.total,
          totalPages: result.totalPages,
        });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  function handleNavigateToMenu(id) {
    navigate(`/menu-items/${id}`);
  }

  return (
    <main className="flex flex-col h-full w-full p-5 pt-5 gap-6">
      <article className="grid grid-cols-3 gap-6 px-10 min-h-full">
        {restaurants?.map((item) => (
          <div
            className="flex flex-col h-70 rounded-xl gap-2 bg-purple-400 shadow p-4"
            key={item.restaurant_id}
          >
            <div className="flex-1 bg-purple-100 rounded object-cover">
              <img
                src="../src/assets/placeholder.png"
                alt={item.restaurant_name}
                className="h-full w-full rounded object-cover"
              />
            </div>
            <div className="flex justify-between bg-purple-100 p-2 rounded">
              <h1 className="capitalize">
                <span className="font-medium">{item.restaurant_name}</span> (
                {item.country})
              </h1>
              <button
                onClick={() => handleNavigateToMenu(item.restaurant_id)}
                className="bg-purple-500 hover:bg-purple-400 hover:cursor-pointer text-white px-2 rounded"
              >
                Menu
              </button>
            </div>
          </div>
        ))}
      </article>
      {/* <section className="bg-purple-200 rounded-lg w-full h-20"></section> */}
    </main>
  );
}
