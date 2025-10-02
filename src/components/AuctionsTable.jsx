import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "./Contant/URL";

export default function AuctionsTable() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [expandedRow, setExpandedRow] = useState(null);

  const [salesData, setSalesData] = useState([]);

  const [getAuctions, setGetAuctions] = useState([]);

  console.log("get Auction =>", getAuctions);

  useEffect(() => {
    fetch(`${BASE_URL}/liveAuctions`)
      .then((res) => res.json())
      .then((data) => setSalesData(data))
      .catch((err) => console.error("Error fetching auctions:", err));
  }, []);

  const filteredSales = salesData?.filter((sale) =>
    sale.locationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetAuctions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todayAuction`);
      setGetAuctions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchAuction = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/todayAuction?search=${searchTerm}`
      );
      setGetAuctions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAuctions();

    if (searchTerm) {
      handleSearchAuction();
    }
  }, [searchTerm]);

  return (
    <div className="px-6 pt-2">
      <input
        type="text"
        placeholder="Search Auctions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded"
      />
      <table className="min-w-full table-auto border border-gray-300 mb-2">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border-b">SR#</th>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Auction Date</th>
            <th className="px-4 py-2 border-b">Auction Status</th>
          </tr>
        </thead>
        <tbody>
          {getAuctions?.map((sale, index) => (
            <tr
              key={sale.userId}
              className="border-b hover:bg-gray-50 text-left"
              onClick={() => navigate(`/standardline/${sale.vehicleId}`)}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-semibold">{sale.locationId}</td>
              <td className="px-4 py-2">{sale.startTime.slice(0, 10)}</td>
              <td
                className={` lg:px-12 px-6 py-2  ${
                  sale?.auctionStatus === "live"
                    ? "text-green-500 font-bold "
                    : "text-red-500 font-bold "
                } `}
              >
                {sale?.auctionStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {getAuctions.length === 0 && (
        <div className="flex items-center justify-center font-bold py-1">
          No data found!
        </div>
      )}
    </div>
  );
}
