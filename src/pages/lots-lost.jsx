// components/LotsLost.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const LotsLost = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    if (!user?.id) return;

    const fetchLossBids = async () => {
      try {
        const res = await fetch(`http://localhost:3001/customer/lotsLost/${user.id}`);
        const data = await res.json();
        const sorted = data.sort((a, b) => b.maxBid - a.maxBid);
        setBids(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error("Failed to fetch lost bids:", err);
      }
    };

    fetchLossBids();
  }, [user?.id]);

  useEffect(() => {
    const result = bids.filter((bid) =>
      bid.vin.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, bids]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-red-700">Loss Bids</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={() => setView(view === "table" ? "grid" : "table")}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            {view === "table" ? "Grid View" : "Table View"}
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="space-y-4 md:space-y-0 md:overflow-x-auto md:rounded-lg md:shadow md:block">
          {/* Mobile Cards View */}
          <div className="md:hidden grid gap-4">
            {paginated.map((bid) => (
              <div key={bid._id} className="border rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={bid.image || "/no-image.jpg"}
                    alt="Vehicle"
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-bold text-red-700">
                      {bid.make} {bid.model}
                    </p>
                    <p className="text-sm text-gray-500">VIN: {bid.vin}</p>
                  </div>
                </div>
                <p><span className="font-semibold">Year:</span> {bid.year}</p>
                <p><span className="font-semibold">Loss:</span> <span className="text-red-600 font-bold">${bid.maxBid}</span></p>
              </div>
            ))}
          </div>

     
          <table className="hidden md:table w-full table-auto border-collapse">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">VIN</th>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-left">Make</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Maximum Bid</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((bid) => (
                <tr key={bid._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={bid.image || "/no-image.jpg"}
                      alt="Vehicle"
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{bid.vin}</td>
                  <td className="p-3">{bid.year}</td>
                  <td className="p-3">{bid.make}</td>
                  <td className="p-3">{bid.model}</td>
                  <td className="p-3 font-semibold text-red-600">{bid.maxBid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginated.map((bid) => (
            <div
              key={bid._id}
              className="border rounded-lg shadow-md hover:shadow-lg transition p-4"
            >
              <img
                src={bid.image || "/no-image.jpg"}
                alt="Vehicle"
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold text-red-700">
                {bid.make} {bid.model}
              </h2>
              <p className="text-sm text-gray-500">VIN: {bid.vin}</p>
              <p className="text-sm text-gray-500">Year: {bid.year}</p>
              <p className="text-lg font-bold text-red-600 mt-2">{bid.maxBid}</p>
            </div>
          ))}
        </div>
      )}

   
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              i + 1 === page
                ? "bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LotsLost;
