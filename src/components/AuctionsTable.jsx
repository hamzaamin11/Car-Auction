import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./Contant/URL";
import { Search } from "lucide-react";
import CustomDropdown from "../CustomDropdown";

export default function AuctionsTable() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [getAuctions, setGetAuctions] = useState([]);

  const convertTo12Hour = (time) => {
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  // Fetch all today's auctions initially
  const handleGetAuctions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction`);
      setGetAuctions(res.data || []);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  // Fetch searched auctions when searchTerm changes
  const handleSearchAuction = async (term) => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction?search=${term}`);
      setGetAuctions(res.data || []);
    } catch (error) {
      console.error("Error searching auctions:", error);
    }
  };

  // Run on mount and when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      handleGetAuctions();
    } else {
      handleSearchAuction(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-2">
      {/* 🔍 Search Input and Title */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Today's Auctions
        </h1>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 🧾 Auctions Table */}
      <div className="overflow-x-auto rounded">
        <table className="min-w-full    mb-2  ">
          <thead>
            <tr className="bg-blue-950  text-left text-xs sm:text-sm">
              <th className="px-2 sm:px-4 py-3 text-white">SR#</th>
              <th className="px-2 sm:px-4 py-3  text-white">Image</th>
              <th className="px-2 sm:px-4 py-3  text-white">Model</th>
              <th className="px-2 sm:px-4 py-3  hidden md:table-cell text-white">
                Location
              </th>
              <th className="px-2 sm:px-4 py-3  text-white">Auction Date</th>
              <th className="px-2 sm:px-4 py-3  text-white">Auction Start</th>
              <th className="px-2 sm:px-4 py-3 text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {getAuctions.length > 0 ? (
              getAuctions.map((sale, index) => {
                //  You can log anything here

                return (
                  <tr
                    key={sale.vehicleId || index}
                    className="border-b hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                    onClick={() => navigate(`/detailbid/${sale.vehicleId}`)}
                  >
                    <td className="px-2 sm:px-4 py-2">{index + 1}</td>

                    {/* 🖼️ Image */}
                    <td className="px-2 sm:px-4 py-2 ">
                      <img
                        src={sale.images?.[0] || "/no-image.png"}
                        alt={`${sale.make} ${sale.model}`}
                        className="w-16 sm:w-20 h-12 sm:h-16 object-cover rounded"
                      />
                    </td>

                    <td className="px-2 sm:px-6 py-2 font-semibold text-gray-800">
                      {sale.make} {sale.model}
                    </td>

                    {/* 📍 Location */}
                    <td className="px-2 sm:px-4 py-2 hidden md:table-cell font-semibold">
                      {sale.locationId}
                    </td>

                    {/* 📅 Date */}
                    <td className="px-2 sm:px-4 py-2">
                      {sale.startTime
                        ? new Date(sale.startTime).toLocaleDateString("en-GB") // 🇬🇧 gives dd/mm/yyyy
                        : "N/A"}
                    </td>

                    <td className="px-2 sm:px-4 py-2">
                      {convertTo12Hour(sale.startTime.slice(10))}
                    </td>

                    {/* 🟢 Status */}
                    <td
                      className={`px-2 sm:px-4 py-2 font-bold ${
                        sale.auctionStatus === "live"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {sale.auctionStatus || "N/A"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 font-semibold text-gray-500 text-sm sm:text-base"
                >
                  No auctions found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
