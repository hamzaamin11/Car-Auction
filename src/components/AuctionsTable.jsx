import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./Contant/URL";

export default function AuctionsTable() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [getAuctions, setGetAuctions] = useState([]);

  // ✅ Fetch all today's auctions initially
  const handleGetAuctions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction`);
      setGetAuctions(res.data || []);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  // ✅ Fetch searched auctions when searchTerm changes
  const handleSearchAuction = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction?search=${term}`);
      setGetAuctions(res.data || []);
    } catch (error) {
      console.error("Error searching auctions:", error);
    }
  };

  // ✅ Run on mount and when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      handleGetAuctions();
    } else {
      handleSearchAuction(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="px-6 pt-2">
      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search Auctions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      {/* 🧾 Auctions Table */}
      <table className="min-w-full table-auto border border-gray-300 mb-2">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border-b">SR#</th>
            <th className="px-4 py-2 border-b">Image</th>
            <th></th>
            <th className="px-4 py-2 border-b">Model</th>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Auction Date</th>
            <th className="px-4 py-2 border-b">Status</th>
          </tr>
        </thead>

        <tbody>
          {getAuctions.length > 0 ? (
            getAuctions.map((sale, index) => (
              <tr
                key={sale.vehicleId || index}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/detailbid/${sale.vehicleId}`)}
              >
                <td className="px-4 py-2">{index + 1}</td>

                {/* 🖼️ Image */}
                <td className="px-4 py-2 w-24 h-16 text-center">
                  <img
                    src={sale.images?.[0] || "/no-image.png"}
                    alt={`${sale.make} ${sale.model}`}
                    className="w-20 h-16 object-cover rounded mx-auto"
                  />
                </td>

                <td></td>
                <td className="py-2 px-6 font-semibold text-gray-800">
                  {sale.make} {sale.model}
                </td>
                {/* 📍 Location */}
                <td className="px-4 py-2 font-semibold">{sale.locationId}</td>

                {/* 📅 Date */}
                <td className="px-4 py-2">
                  {sale.startTime?.slice(0, 10) || "N/A"}
                </td>

                {/* 🟢 Status */}
                <td
                  className={`px-4 py-2 font-bold ${
                    sale.auctionStatus === "live"
                      ? "text-green-500 "
                      : "text-red-500"
                  }`}
                >
                  {sale.auctionStatus || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4 font-semibold text-gray-500"
              >
                No auctions found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
